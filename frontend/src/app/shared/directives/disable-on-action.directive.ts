import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActionsService } from '../services/actions.service';
import { AsyncSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDisableOnAction]'
})
export class DisableOnActionDirective implements OnInit, OnDestroy {
  onDestroy = new AsyncSubject<void>();

  constructor(
    private element: ElementRef,
    private actionsService: ActionsService
  ) { }

  ngOnInit() {
    const button: HTMLButtonElement = this.element.nativeElement;

    this.actionsService.getActionState().pipe(
      takeUntil(this.onDestroy)
    ).subscribe((state: boolean) => {
      button.disabled = state;
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

}
