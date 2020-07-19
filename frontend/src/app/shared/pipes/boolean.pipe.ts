import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appBoolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Tak' : 'Nie';
  }

}
