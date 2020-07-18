import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSize'
})
export class ConvertSizePipe implements PipeTransform {

  transform(value: number): string {
    return (value / 1024).toFixed(2);
  }

}
