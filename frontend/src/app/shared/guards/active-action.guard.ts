import { Injectable } from '@angular/core';
import { UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionsService } from '../services/actions.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { translations } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class ActiveActionGuard implements CanDeactivate<any> {

  constructor(
    private actionsService: ActionsService,
    private dialog: MatDialog
  ) {

  }

  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      if (this.actionsService.getEditingActionStateValue() === false) {
        resolve(true);
        return;
      }

      const dialogData: ConfirmationDialogData = {
        title: translations.DEACTIVATE_CONFIRMATION
      };

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result === true) {
          this.actionsService.stopEditingAction();
        }
        resolve(result);
      });
    });
  }

}
