import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ChangePasswordDialogComponent } from './components/user-panel/dialogs/change-password-dialog/change-password-dialog.component';
import { ConvertSizePipe } from './pipes/convert-size.pipe';
import { DeleteAccountDialogComponent } from './components/user-panel/dialogs/delete-account-dialog/delete-account-dialog.component';
import { NumberInputDirective } from './directives/number-input-validation.directive';
import { DisableOnActionDirective } from './directives/disable-on-action.directive';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConvertUserRolePipe } from './pipes/convert-user-role.pipe';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { BooleanPipe } from './pipes/boolean.pipe';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DisableContextMenuDirective } from './directives/disable-context-menu.directive';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorIntlDirective } from './directives/paginator-intl.directive';
import { ActionButtonComponent } from './components/action-button/action-button.component';

const sharedModules = [
  MaterialModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatMomentDateModule,
  TranslateModule,
  ToastrModule
];

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
    BooleanPipe,
    DisableContextMenuDirective,
    PaginatorIntlDirective,
    ActionButtonComponent
  ],
  imports: [
    CommonModule,
    sharedModules
  ],
  exports: [
    sharedModules,
    ConvertSizePipe,
    ChangePasswordDialogComponent,
    DeleteAccountDialogComponent,
    NumberInputDirective,
    DisableOnActionDirective,
    ConfirmationDialogComponent,
    ConvertUserRolePipe,
    UserPanelComponent,
    BooleanPipe,
    DisableContextMenuDirective,
    PaginatorIntlDirective,
    ActionButtonComponent
  ]
})
export class SharedModule { }
