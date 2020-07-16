import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

      const currentUser = await this.authService.getCurrentUser(currentUserToken);
      if (!currentUser || !currentUser.isLoggedIn) {
        resolve(false);
        this.router.navigateByUrl('/login');
        return;
      }

      resolve(true);
    });
  }

}
