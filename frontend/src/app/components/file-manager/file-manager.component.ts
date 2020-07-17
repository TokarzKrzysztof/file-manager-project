import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/User';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from 'src/app/dialogs/delete-account-dialog/delete-account-dialog.component';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ChangePasswordDialogComponent, PasswordChangeData } from 'src/app/dialogs/change-password-dialog/change-password-dialog.component';

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
    private authService: AuthService,
    private dialog: MatDialog
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
    this.dialog.open(ChangePasswordDialogComponent).afterClosed().subscribe((result: PasswordChangeData) => {
      if (result) {
        const token = window.localStorage.getItem('currentUserToken');
        this.authService.changePassword(token, result);
      }
    })
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
}
