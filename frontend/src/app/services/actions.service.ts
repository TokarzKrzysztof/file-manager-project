import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  actionState = new Subject<boolean>();

  constructor() { }

  getActionState(): Observable<boolean> {
    return this.actionState.asObservable();
  }

  startAction() {
    this.actionState.next(true);
  }

  stopAction() {
    this.actionState.next(false);
  }
}
