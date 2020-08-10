import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSize'
})
export class ConvertSizePipe implements PipeTransform {

  transform(source: number, target: 'KB' | 'MB' | 'GB'): string {
    if (target === 'KB') {
      return (source / 1024).toFixed(2);
    }
    else if (target === 'MB') {
      return (source / 1048576).toFixed(2);
    }
    else if (target === 'GB') {
      return (source / 1073741824).toFixed(2);
    }
  }

}
