import { Injectable } from '@angular/core';
import { UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ActionsService } from '../services/actions.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../dialogs/confirmation-dialog/confirmation-dialog.component';

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
      if (this.actionsService.getActionStateValue() === false) {
        resolve(true);
        return;
      }

      const dialogData: ConfirmationDialogData = {
        title: 'Czy na pewno chcesz wyjść? Twoje dane mogą nie zostać zapisane!'
      };

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        this.actionsService.stopAction();
        resolve(result);
      });
    });
  }

}
