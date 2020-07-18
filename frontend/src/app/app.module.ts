import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { RegisterComponent } from './components/register/register.component';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { FilesHistoryComponent } from './components/files-history/files-history.component';
import { FilesListComponent } from './components/files-list/files-list.component';
import { ConvertSizePipe } from './pipes/convert-size.pipe';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { DisableOnActionDirective } from './directives/disable-on-action.directive';
import { NumberInputDirective } from './directives/number-input-validation.directive';
import '@angular/common/locales/global/PL';
import { DeleteAccountDialogComponent } from './dialogs/delete-account-dialog/delete-account-dialog.component';
import { ChangePasswordDialogComponent } from './dialogs/change-password-dialog/change-password-dialog.component';
import { RemindPasswordComponent } from './components/remind-password/remind-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    FileManagerComponent,
    RegisterComponent,
    FilesHistoryComponent,
    FilesListComponent,
    ConvertSizePipe,
    ConfirmationDialogComponent,
    DisableOnActionDirective,
    NumberInputDirective,
    DeleteAccountDialogComponent,
    ChangePasswordDialogComponent,
    RemindPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-middle-top',
      preventDuplicates: true,
    })
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pl-PL'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
