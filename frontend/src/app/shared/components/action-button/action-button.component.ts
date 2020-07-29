import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ActionsService } from '../../services/actions.service';
import { takeUntil } from 'rxjs/operators';
import { AsyncSubject } from 'rxjs';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss']
})
export class ActionButtonComponent implements OnInit, OnDestroy {
  @Output() buttonClicked = new EventEmitter<MouseEvent>();
  onDestroy = new AsyncSubject<void>();
  actionState: boolean;

  constructor(
    private actionsService: ActionsService
  ) { }

  ngOnInit(): void {
    this.actionsService.getBackendActionState().pipe(
      takeUntil(this.onDestroy)
    ).subscribe((state: boolean) => {
      this.actionState = state;
    });
  }

  onClick(e: MouseEvent) {
    this.buttonClicked.emit(e);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
