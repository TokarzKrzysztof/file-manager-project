import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileManagerComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  ngOnInit() {
  }

  async logout() {
    const userToken = window.localStorage.getItem('currentUserToken');
    if (userToken) {
      await this.authService.logout(userToken);
      window.localStorage.removeItem('currentUserToken');
      this.router.navigateByUrl('/login');
    }
  }
}
