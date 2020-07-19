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
  maxFileSizes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  minNumberValidator = 0;
  maxPasswordValidator = 5;
  maxLimitPerHourValidator = 20;

  filesSettings = new FormGroup({
    maxSize: new FormControl(null, [Validators.required]),
    limitPerHour: new FormControl(null,
      [Validators.required, Validators.min(this.minNumberValidator), Validators.max(this.maxLimitPerHourValidator)]),
  });

  passwordSettings = new FormGroup({
    minLength: new FormControl(null,
      [Validators.required, Validators.min(this.minNumberValidator), Validators.max(this.maxPasswordValidator)]),
    minDigits: new FormControl(null,
      [Validators.required, Validators.min(this.minNumberValidator), Validators.max(this.maxPasswordValidator)]),
    bigLetters: new FormControl(null,
      [Validators.required, Validators.min(this.minNumberValidator), Validators.max(this.maxPasswordValidator)]),
    specialCharacters: new FormControl(null,
      [Validators.required, Validators.min(this.minNumberValidator), Validators.max(this.maxPasswordValidator)]),
  });

  constructor(
    private toast: ToastrService,
    private globalSettingsService: GlobalSettingsService
  ) { }

  async ngOnInit() {
    const settings: GlobalSettingsModel = await this.globalSettingsService.getGlobalSettings();

    this.filesSettings.patchValue(settings);
    this.passwordSettings.patchValue(settings);
  }

  async onSave() {
    this.filesSettings.markAllAsTouched();
    this.passwordSettings.markAllAsTouched();

    if (this.filesSettings.invalid || this.passwordSettings.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    const settings: GlobalSettingsModel = { ...this.filesSettings.getRawValue(), ...this.passwordSettings.getRawValue() };
    await this.globalSettingsService.setGlobalSettings(settings);
  }


}
