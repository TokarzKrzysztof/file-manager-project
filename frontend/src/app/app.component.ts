import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private currentUser: UserModel;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    const currentUserToken: string = window.localStorage.getItem('currentUserToken');
    if (currentUserToken) {
      this.currentUser = await this.authService.getCurrentUser(currentUserToken);
      this.router.navigateByUrl(this.currentUser.isLoggedIn ? '/file-manager' : '/login');
    } else {
      this.router.navigateByUrl('/login');
    }

  }
}
