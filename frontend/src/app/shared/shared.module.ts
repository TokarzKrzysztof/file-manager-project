import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ChangePasswordDialogComponent } from '../modules/file-manager-modules/dialogs/change-password-dialog/change-password-dialog.component';
import { ConvertSizePipe } from './pipes/convert-size.pipe';
import { DeleteAccountDialogComponent } from '../modules/file-manager-modules/dialogs/delete-account-dialog/delete-account-dialog.component';
import { NumberInputDirective } from './directives/number-input-validation.directive';
import { DisableOnActionDirective } from './directives/disable-on-action.directive';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConvertUserRolePipe } from './pipes/convert-user-role.pipe';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { BooleanPipe } from './pipes/boolean.pipe';



@NgModule({
  declarations: [
    ConvertSizePipe,
    ChangePasswordDialogComponent,
    DeleteAccountDialogComponent,
    NumberInputDirective,
    DisableOnActionDirective,
    ConfirmationDialogComponent,
    ConvertUserRolePipe,
    UserPanelComponent,
    BooleanPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-middle-top',
      preventDuplicates: true,
    })
  ],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule,
    ConvertSizePipe,
    ChangePasswordDialogComponent,
    DeleteAccountDialogComponent,
    NumberInputDirective,
    DisableOnActionDirective,
    ConfirmationDialogComponent,
    ConvertUserRolePipe,
    UserPanelComponent,
    BooleanPipe
  ]
})
export class SharedModule { }
