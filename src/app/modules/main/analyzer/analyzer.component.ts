import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import AgentFacade from 'src/app/core/facades/agent.facade';
import CallFacade from 'src/app/core/facades/call.facade';
import Script from 'src/app/core/models/script.model';
import Transcript from 'src/app/core/models/transcript.model';

import TemplateService from 'src/app/core/services/template.service';

@Component({
  selector: 'app-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AnalyzerComponent implements OnInit, AfterViewInit {
  @ViewChild('subHeader')
  private subHeader?: TemplateRef<any>;
  private numberScriptsInLine = 0;
  public dataSource: any[] = [];
  public transcript: Transcript | undefined;
  public percentageScriptCovered = 0;
  public percentageScriptInLines = 0;
  public percentage = 38;
  public hoverState = false;
  public transcriptSentence = '';

  constructor(public agents: AgentFacade, public _calls: CallFacade, private _tplService: TemplateService) {}

  public ngAfterViewInit(): void {
    this._tplService.register('subHeader', this.subHeader);
  }

  public ngOnInit(): void {
    this._calls.activeTranscript$.subscribe((transcripts) => (this.transcript = transcripts));
  }

  public selectCall(call: string): void {
    this._calls.selectCall(call);
    this.dataSource = this.mockTranscriptData();
    this.percentageScriptCovered = this.scriptCoverage();
    this.percentageScriptInLines = this.scriptInLines();
  }

  public hoverManagement(hoverState: boolean, transcriptLine: any) {
    this.hoverState = hoverState;
    this.transcriptSentence = transcriptLine.matchingSentence;
  }

  private mockTranscriptData(): any {
    const DATA: {
      time: string;
      speaker: any;
      sentence: string;
      similarity: number;
      matchingSentence: string;
      matchingLine: string | undefined;
      covered: boolean;
    }[] = [];

    // Channels:  0 - Unknown ; 1 - Agent ; 2 - Customer
    const SPEAKERS = ['Unknown', this.transcript?.agent?.speakerName, this.transcript?.customer?.speakerName];
    let pastChannel: number;

    this.transcript?.transcript.forEach((transcriptLine) => {
      DATA.push({
        time: this.formatTime(transcriptLine.timeFrom),
        speaker: pastChannel === transcriptLine.channel ? '' : SPEAKERS[transcriptLine.channel],
        sentence: transcriptLine.sentence,
        similarity: transcriptLine.similarity < 0 ? 0 : transcriptLine.similarity,
        matchingSentence: transcriptLine.matching_sentence,
        matchingLine: this.matchSentences(transcriptLine)?.toString(),
        covered: transcriptLine.matching_sentence ? true : false,
      });
      pastChannel = transcriptLine.channel;
    });

    return DATA;
  }

  private matchSentences(transcriptLine: Script): number | undefined {
    let order = undefined;
    this.transcript?.script.forEach((scriptLine) => {
      if (transcriptLine.matching_sentence === scriptLine.sentence) {
        if (transcriptLine.channel === 1) {
          this.numberScriptsInLine += 1;
          scriptLine.covered = true;
        }
        order = scriptLine.order + 1;
      }
    });
    return order;
  }

  private formatTime(time: any): string {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time - min * 60);

    const formatedTime = (min > 9 ? '' : '0') + min + ':' + (sec > 9 ? '' : '0') + sec;

    return formatedTime;
  }

  private scriptCoverage(): number {
    let numberCovered = 0;
    let percentage = 0;

    this.transcript?.script.forEach((script) => (script.covered ? (numberCovered += 1) : undefined));

    this.transcript ? (percentage = numberCovered / this.transcript?.script.length) : undefined;

    return percentage;
  }

  private scriptInLines(): number {
    let percentage = 0;
    let totalLinesByAgent = 0;
    this.transcript
      ? ((totalLinesByAgent = this.transcript.transcript.filter((line) => line.channel === 1).length),
        (percentage = this.numberScriptsInLine / totalLinesByAgent))
      : undefined;

    return percentage;
  }
}
