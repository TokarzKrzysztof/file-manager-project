import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActionsService } from './shared/services/actions.service';
import { DataService } from './shared/services/data.service';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MobileWarningDialogComponent } from './shared/dialogs/mobile-warning-dialog/mobile-warning-dialog.component';

export let translations: { [key: string]: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isMobile: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translateService: TranslateService,
    private actionsService: ActionsService,
    private dataService: DataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.showUnloadConfirmation();
    this.setTranslations();
    this.checkIfIsMobilePhone();
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

  private checkIfIsMobilePhone() {
    this.isMobile = window.innerWidth <= 1024;
    this.dataService.setIsMobile(this.isMobile);

    if (this.isMobile) {
      this.document.body.setAttribute('id', 'mobile');
      this.dialog.open(MobileWarningDialogComponent);
    }
  }
}
