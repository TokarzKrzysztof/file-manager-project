import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/modules/auth-modules/auth.service';
import { Router } from '@angular/router';
import { PasswordChangeData, ChangePasswordDialogComponent } from 'src/app/modules/file-manager-modules/dialogs/change-password-dialog/change-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from 'src/app/modules/file-manager-modules/dialogs/delete-account-dialog/delete-account-dialog.component';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { ConfirmationDialogData, ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { UserModel } from 'src/app/modules/auth-modules/model-UserModel';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss']
})
export class UserPanelComponent implements OnInit {
  @Input() showAdministrationPanelLink: boolean;
  @Input() showFileManagerLink: boolean;
  currentUser: UserModel;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authService.getCurrentUserValue();
  }

  async logout() {
    const token = window.localStorage.getItem('currentUserToken');
    if (token) {
      await this.authService.logout(token);
      window.localStorage.removeItem('currentUserToken');
      this.authService.clearCurrentUserValue();
      this.router.navigateByUrl('/login');
    }
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialogComponent).afterClosed().subscribe(async (result: PasswordChangeData) => {
      if (result) {
        const token = window.localStorage.getItem('currentUserToken');
        await this.authService.changePassword(token, result);
      }
    });
  }

  async deleteAccount() {
    let password: string;

    this.dialog.open(DeleteAccountDialogComponent).afterClosed().pipe(
      switchMap((result: string) => {
        if (result) {
          password = result;
          return this.showAccountDeleteConfirmationDialog();
        }
        return of(false);
      })
    ).subscribe(async (result: boolean) => {
      if (result) {
        const token = window.localStorage.getItem('currentUserToken');
        await this.authService.deleteAccount(token, password);
        this.router.navigateByUrl('/login');
      }
    });
  }

  private showAccountDeleteConfirmationDialog(): Observable<boolean> {
    const dialogData: ConfirmationDialogData = {
      title: 'Czy na pewno chcesz usunąć konto?'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    return dialogRef.afterClosed();
  }

  showAdminPanel() {
    this.router.navigateByUrl('/administration');
  }

  showFileManager() {
    this.router.navigateByUrl('/file-manager');
  }
}
