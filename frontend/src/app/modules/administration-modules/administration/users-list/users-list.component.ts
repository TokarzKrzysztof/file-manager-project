import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth-modules/auth.service';
import { UserModel } from 'src/app/modules/auth-modules/model-UserModel';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users: UserModel[] = [];

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.users = await this.authService.getAllUsers();
    const currentUser = await this.authService.getCurrentUserValue();
    this.users = this.users.filter(x => x.id !== currentUser.id);
  }

}
