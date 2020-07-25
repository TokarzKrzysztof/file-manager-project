import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import '@angular/common/locales/global/PL';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPolishPaginatorIntl } from './polish-paginator-intl';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-middle-top',
      preventDuplicates: true,
    }),
    TranslateModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    { provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl() },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
