import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import '@angular/common/locales/global/PL';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPolishPaginatorIntl } from './polish-paginator-intl';
import { MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    { provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl() },
    // { provide: MAT, useValue: { useUtc: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
