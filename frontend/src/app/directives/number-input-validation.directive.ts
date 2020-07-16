import { Directive, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberInput]'
})
export class NumberInputDirective implements OnInit {

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit() {
    (this.el.nativeElement as HTMLInputElement).min = '0';
    (this.el.nativeElement as HTMLInputElement).type = 'number';
  }

  @HostListener('keypress', ['$event']) onInput(event: KeyboardEvent) {
    const permittedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    if (permittedKeys.includes(event.key)) {
      return true;
    } else {
      return false;
    }
  }

}
