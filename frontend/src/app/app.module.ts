import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import '@angular/common/locales/global/PL';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorIntlFactory } from './paginator-intl';

class DynamicLocaleId extends String {
  constructor(protected translateService: TranslateService) {
    super('');
  }

  toString() {
    return this.translateService.currentLang;
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    TranslateModule.forRoot({
      defaultLanguage: 'pl',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [TranslateService]
    },
    {
      provide: MatPaginatorIntl,
      useFactory: PaginatorIntlFactory,
      deps: [TranslateService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

