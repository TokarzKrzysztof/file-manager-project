import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

export let translations: {[key: string]: string};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    const defaultLang = 'en';
    this.translateService.setDefaultLang(defaultLang);

    this.translateService.onLangChange.subscribe((event: TranslationChangeEvent) => {
      translations = this.translateService.translations[event.lang];
      window.localStorage.setItem('currentUserLang', event.lang);
    });

    const currentUserLang = window.localStorage.getItem('currentUserLang');
    const usedLang = currentUserLang || defaultLang;
    this.translateService.use(usedLang);
  }
}
