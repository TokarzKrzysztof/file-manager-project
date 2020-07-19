import { Component, OnInit } from '@angular/core';
import { GlobalSettingsService } from './modules/administration-modules/global-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private globalSettingsService: GlobalSettingsService
  ) { }

  ngOnInit() {
    this.globalSettingsService.getGlobalSettings();
  }
}
