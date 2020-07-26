import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

export let translations;

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

    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    translations = this.translateService.translations[defaultLang];

    this.translateService.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
      translations = this.translateService.translations[event.lang];
    });
  }
}
