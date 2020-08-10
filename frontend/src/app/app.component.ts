import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { ActionsService } from './shared/services/actions.service';

export let translations: { [key: string]: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private actionsService: ActionsService
  ) { }

  ngOnInit() {
    this.showUnloadConfirmation();
    this.setTranslations();
  }

  private setTranslations() {
    const defaultLang = 'en';
    this.translateService.setDefaultLang(defaultLang);

    const currentUserLang = window.localStorage.getItem('currentUserLang');
    const usedLang = currentUserLang || defaultLang;

    this.translateService.use(usedLang).subscribe(() => {
      translations = this.translateService.translations[usedLang];
    });
  }

  private showUnloadConfirmation() {
    window.addEventListener('beforeunload', (e) => {
      const shouldShowConfirmation = this.actionsService.getBackendActionStateValue() || this.actionsService.getEditingActionStateValue();
      if (shouldShowConfirmation) {
        // modern browsers do not support changing confirmation message, so left it empty
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    });
  }
}
