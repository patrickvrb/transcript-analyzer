import { Injectable } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';
import AgentFacade from 'src/app/core/facades/agent.facade';
import Agent from 'src/app/core/models/agent';

import Call from 'src/app/core/models/call.model';
import Transcript from 'src/app/core/models/transcript.model';
import CallService from 'src/app/core/services/call.service';

@Injectable({ providedIn: 'root' })
export default class CallState {
  private readonly _activeAgentCalls$ = new BehaviorSubject<Call[]>([]);
  private readonly _activeTranscript$ = new Subject<Transcript>();
  private readonly _calls$ = new BehaviorSubject<Call[]>([]);
  private readonly _matchingPercentage$ = new BehaviorSubject<number>(0);
  private readonly _transcripts$ = new BehaviorSubject<Transcript[]>([]);
  private readonly _tableControl$ = new BehaviorSubject<boolean>(false);
  public activeAgentCalls$ = this._activeAgentCalls$.asObservable();
  public activeTranscript$ = this._activeTranscript$.asObservable();
  public calls$ = this._calls$.asObservable();
  public matchingPercentage$ = this._matchingPercentage$.asObservable();
  public tableControl$ = this._tableControl$.asObservable();

  constructor(private readonly _svc: CallService, private readonly _agents: AgentFacade) {
    this._svc.getCalls$().subscribe((calls: Call[]) => this._calls$.next(calls));

    this._svc.getTranscripts$().subscribe((transcripts: Transcript[]) => {
      this._transcripts$.next(transcripts);
    });

    this._agents.activeAgent$.subscribe((agent: Agent) => {
      const calls = this._calls$.value.filter((call: Call) => call.agent?.agentId === agent?.id);

      this._activeAgentCalls$.next(calls);
    });

    this._matchingPercentage$.next(38);
  }

  public selectCall(id: string): void {
    const transcript = this._transcripts$.value.find((transcript: Transcript) => transcript.id === id);
    this._activeTranscript$.next(transcript);
    this._tableControl$.next(true);
    console.log(id, transcript);
  }

  public setMatchingPercentage(value: number | string): void {
    this._matchingPercentage$.next(parseInt(`${value}`));
  }
}
