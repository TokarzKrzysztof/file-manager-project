import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actionState = new Subject<boolean>();
  private actionStateValue = false;

  constructor() { }

  getActionState(): Observable<boolean> {
    return this.actionState.asObservable();
  }

  getActionStateValue(): boolean {
    return this.actionStateValue;
  }

  startAction() {
    this.actionState.next(true);
    this.actionStateValue = true;
  }

  stopAction() {
    this.actionState.next(false);
    this.actionStateValue = false;
  }
}