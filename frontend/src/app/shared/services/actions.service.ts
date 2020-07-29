import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private backendActionState = new Subject<boolean>();
  private backendActionStateValue = false;
  private editingActionStateValue = false;

  constructor() { }

  getBackendActionState(): Observable<boolean> {
    return this.backendActionState.asObservable();
  }

  getBackendActionStateValue(): boolean {
    return this.backendActionStateValue;
  }

  startBackendAction() {
    this.backendActionState.next(true);
    this.backendActionStateValue = true;
  }

  stopBackendAction() {
    this.backendActionState.next(false);
    this.backendActionStateValue = false;
  }

  getEditingActionStateValue(): boolean {
    return this.editingActionStateValue;
  }

  startEditingAction() {
    this.editingActionStateValue = true;
  }

  stopEditingAction() {
    this.editingActionStateValue = false;
  }
}