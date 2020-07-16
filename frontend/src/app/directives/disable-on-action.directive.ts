import { Directive, ElementRef, OnInit } from '@angular/core';
import { ActionsService } from '../services/actions.service';

@Directive({
  selector: '[appDisableOnAction]'
})
export class DisableOnActionDirective implements OnInit {

  constructor(
    private element: ElementRef,
    private actionsService: ActionsService
  ) { }

  ngOnInit() {
    const button: HTMLButtonElement = this.element.nativeElement;

    this.actionsService.getActionState().subscribe((state: boolean) => {
      button.disabled = state;
    });
  }

}
