import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/modules/auth-modules/auth.service';
import { UserModel } from 'src/app/modules/auth-modules/model-UserModel';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { FormControl } from '@angular/forms';
import { debounce, debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @ViewChild(MatSelectionList) selectionList: MatSelectionList;
  usersSearch = new FormControl('');
  currentUser: UserModel;
  users: UserModel[] = [];
  blockedUsers: UserModel[] = [];
  displayedColumns = ['userData', 'blockEdit', 'blockAccess', 'actions'];

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserValue();

    this.usersSearch.valueChanges.pipe(
      filter((value: string) => value !== '' && value.length >= 2),
      debounceTime(300)
    ).subscribe(async (searchString: string) => {
      this.users = await this.authService.searchForUsers(searchString);
      this.users = this.users.filter(x => x.id !== this.currentUser.id);
    });

    this.getBlockedUsers();
  }

  async getBlockedUsers() {
    this.blockedUsers = await this.authService.getBlockedUsers();
  }

  async unlockUser(user: UserModel) {
    await this.authService.unlockUser(user.id);
    this.getBlockedUsers();
  }

  async onBlockEdit() {
    const selectedUsers: MatListOption[] = this.selectionList.selectedOptions.selected;
    const selectedUsersIds = selectedUsers.map(x => (x.value as UserModel).id);
    if (selectedUsers.length === 0) {
      return;
    }
    await this.authService.disableUsersSystemEditing(selectedUsersIds);
    this.getBlockedUsers();
  }

  async onBlockAccess() {
    const selectedUsers: MatListOption[] = this.selectionList.selectedOptions.selected;
    const selectedUsersIds = selectedUsers.map(x => (x.value as UserModel).id);
    if (selectedUsers.length === 0) {
      return;
    }
    await this.authService.disableUsersSystemAccess(selectedUsersIds);
    this.getBlockedUsers();
  }

}
