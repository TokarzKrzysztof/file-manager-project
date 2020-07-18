import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertUserRole'
})
export class ConvertUserRolePipe implements PipeTransform {

  transform(role: 'USER' | 'ADMIN'): string {
    if (role === 'USER') {
      return 'Użytkownik';
    }
    else if (role === 'ADMIN') {
      return 'Administrator';
    }
    else {
      throw new Error('Invalid user role!');
    }
  }

}
