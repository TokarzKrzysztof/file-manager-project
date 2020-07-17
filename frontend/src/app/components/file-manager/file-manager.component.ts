import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/User';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from 'src/app/dialogs/delete-account-dialog/delete-account-dialog.component';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';

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
    const userToken = window.localStorage.getItem('currentUserToken');
    if (userToken) {
      await this.authService.logout(userToken);
      window.localStorage.removeItem('currentUserToken');
      this.authService.clearCurrentUserValue();
      this.router.navigateByUrl('/login');
    }
  }

  async deleteAccount() {
    let password: string;

    this.dialog.open(DeleteAccountDialogComponent).afterClosed().pipe(
      switchMap((result: string) => {
        if (result) {
          password = result;
          return this.showAccountDeleteConfirmationDialog();
        }
      })
    ).subscribe(async (result: boolean) => {
      if (result) {
        const userToken = window.localStorage.getItem('currentUserToken');
        await this.authService.deleteAccount(userToken, password);
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
