import { Pipe, PipeTransform } from '@angular/core';
import { translations } from 'src/app/app.component';

@Pipe({
  name: 'appBoolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? translations.YES : translations.NO;
  }

}
