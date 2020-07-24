import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GlobalSettingsService } from '../../global-settings.service';
import { GlobalSettingsModel } from '../../model-GlobalSettingsModel';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss']
})
export class GlobalSettingsComponent implements OnInit {
  settings: GlobalSettingsModel;
  maxFileSizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  minPasswordValidator = 0;
  maxPasswordValidator = 5;
  minLimitPerHourValidator = 1;
  maxLimitPerHourValidator = 20;

  filesSettings = new FormGroup({
    maxSize: new FormControl(null, [Validators.required]),
    limitPerHour: new FormControl(null,
      [Validators.required, Validators.min(this.minLimitPerHourValidator), Validators.max(this.maxLimitPerHourValidator)]),
  });

  passwordSettings = new FormGroup({
    minLength: new FormControl(null,
      [Validators.required, Validators.min(this.minPasswordValidator), Validators.max(this.maxPasswordValidator)]),
    minDigits: new FormControl(null,
      [Validators.required, Validators.min(this.minPasswordValidator), Validators.max(this.maxPasswordValidator)]),
    bigLetters: new FormControl(null,
      [Validators.required, Validators.min(this.minPasswordValidator), Validators.max(this.maxPasswordValidator)]),
    specialCharacters: new FormControl(null,
      [Validators.required, Validators.min(this.minPasswordValidator), Validators.max(this.maxPasswordValidator)]),
  });

  constructor(
    private toast: ToastrService,
    private globalSettingsService: GlobalSettingsService
  ) { }

  async ngOnInit() {
    this.settings = await this.globalSettingsService.getGlobalSettings();

    this.filesSettings.patchValue(this.settings);
    this.passwordSettings.patchValue(this.settings);
  }

  async onSave() {
    this.filesSettings.markAllAsTouched();
    this.passwordSettings.markAllAsTouched();

    if (this.filesSettings.invalid || this.passwordSettings.invalid) {
      this.toast.error($localize `:@@ENTER_VALID_FIELDS:`);
      return;
    }

    const settings: GlobalSettingsModel = { ...this.filesSettings.getRawValue(), ...this.passwordSettings.getRawValue() };
    settings.id = this.settings.id;

    await this.globalSettingsService.setGlobalSettings(settings);
  }


}
