import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import AgentFacade from 'src/app/core/facades/agent.facade';
import CallFacade from 'src/app/core/facades/call.facade';
import Call from 'src/app/core/models/call.model';
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
  public dataSource: any[] = [];
  public dataSourceRep: any[] = [];
  calls: Call[] = [];
  value = 1;
  formatedCalls: any;
  transcript: Transcript | undefined;
  constructor(
    public agents: AgentFacade,
    public _calls: CallFacade,
    private _tplService: TemplateService,
    private _router: Router
  ) {}

  public ngAfterViewInit(): void {
    this._tplService.register('subHeader', this.subHeader);
  }

  public ngOnInit(): void {
    // this.dataSourceRep = MOCK_DATA().slice(-25);
  }

  public selectAgent(event: any): void {
    this.agents.setActiveAgent(event.value);
    this._calls.activeAgentCalls$.subscribe((calls) => (this.calls = calls));
    this._calls.activeTranscript$.subscribe(
      (transcripts) => (this.transcript = transcripts)
    );
  }

  public selectCall(event: any): void {
    this._calls.selectCall(event.value);
    this.dataSource = this.mockData();
  }

  private mockData = () => {
    const DATA: {
      time: string;
      speaker: any;
      sentence: string;
    }[] = [];

    // Channels:  0 - Unknown ; 1 - Agent ; 2 - Customer
    const SPEAKERS = [
      'Unknown',
      this.transcript?.agent?.speakerName,
      this.transcript?.customer?.speakerName,
    ];
    let pastChannel: number;

    this.transcript?.transcript.forEach((transcriptLine) => {
      DATA.push({
        time: this.formatTime(transcriptLine.timeFrom),
        speaker:
          pastChannel === transcriptLine.channel
            ? ''
            : SPEAKERS[transcriptLine.channel],
        sentence: transcriptLine.sentence,
      });
      pastChannel = transcriptLine.channel;
    });

    console.log(DATA);

    return DATA;
  };

  private formatTime(time: any): string {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time - min * 60);

    const formatedTime =
      (min > 9 ? '' : '0') + min + ':' + (sec > 9 ? '' : '0') + sec;

    return formatedTime;
  }
}
