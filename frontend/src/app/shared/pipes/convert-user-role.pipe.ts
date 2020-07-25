import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'convertUserRole'
})
export class ConvertUserRolePipe implements PipeTransform {

  constructor(
    private translateService: TranslateService
  ) {
  }

  transform(role: 'USER' | 'ADMIN'): string {
    const currentLang = this.translateService.currentLang;
    
    if (role === 'USER') {
      return this.translateService.translations[currentLang].USER;
    }
    else if (role === 'ADMIN') {
      return this.translateService.translations[currentLang].ADMIN;
    }
    else if (role !== '' && typeof role === 'string') {
      throw new Error('Invalid user role!');
    }
  }

}
