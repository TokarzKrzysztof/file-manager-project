import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/modules/auth-modules/auth.service';
import { UserModel } from 'src/app/modules/auth-modules/model-UserModel';
import { MatSelectionList, MatListOption } from '@angular/material/list';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @ViewChild(MatSelectionList) selectionList: MatSelectionList;
  currentUser: UserModel;
  allUsers: UserModel[] = [];
  usersForList: UserModel[] = [];
  blockedUsers: UserModel[] = [];
  displayedColumns = ['userData', 'blockEdit', 'blockAccess', 'actions'];

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserValue();
    this.loadUsers();
  }

  async loadUsers() {
    this.allUsers = await this.authService.getAllUsers();

    this.usersForList = this.allUsers.filter(x => x.id !== this.currentUser.id && (x.systemAccess || x.systemEditingEnabled));
    this.blockedUsers = this.allUsers.filter(x => x.systemAccess === false || x.systemEditingEnabled === false);
  }

  async unlockUser(user: UserModel) {
    await this.authService.unlockUser(user.id);
    this.loadUsers();
  }

  async onBlockEdit() {
    const selectedUsers: MatListOption[] = this.selectionList.selectedOptions.selected;
    const selectedUsersIds = selectedUsers.map(x => (x.value as UserModel).id);
    if (selectedUsers.length === 0) {
      return;
    }
    await this.authService.disableUsersSystemEditing(selectedUsersIds);
    this.loadUsers();
  }

  async onBlockAccess() {
    const selectedUsers: MatListOption[] = this.selectionList.selectedOptions.selected;
    const selectedUsersIds = selectedUsers.map(x => (x.value as UserModel).id);
    if (selectedUsers.length === 0) {
      return;
    }
    await this.authService.disableUsersSystemAccess(selectedUsersIds);
    this.loadUsers();
  }

}
