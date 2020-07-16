import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/User';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileManagerComponent implements OnInit {
  currentUser: UserModel;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserValue();
  }

  async logout() {
    const userToken = window.localStorage.getItem('currentUserToken');
    if (userToken) {
      await this.authService.logout(userToken);
      window.localStorage.removeItem('currentUserToken');
      this.authService.clearCurrentUserValue();
      this.router.navigateByUrl('/login');
    }
  }
}
