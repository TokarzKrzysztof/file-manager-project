import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth-modules/auth.service';
import { UserModel } from 'src/app/modules/auth-modules/model-UserModel';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const currentUserToken: string = window.localStorage.getItem('currentUserToken');
      if (!currentUserToken) {
        resolve(false);
        this.router.navigateByUrl('/login');
        return;
      }

      const currentUser: UserModel = await this.authService.getCurrentUserValue();
      if (!currentUser || !currentUser.isLoggedIn) {
        resolve(false);
        this.router.navigateByUrl('/login');
        return;
      }

      resolve(true);
    });
  }

}
