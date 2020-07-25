import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from '../auth.service';
import { UserModel } from '../model-UserModel';
import { Router } from '@angular/router';
import { GlobalSettingsService } from '../../administration-modules/global-settings.service';
import { GlobalSettingsModel } from '../../administration-modules/model-GlobalSettingsModel';

class PasswordRequirementsValidation {
  minLength: boolean;
  specialCharacters: boolean;
  bigLetters: boolean;
  minDigits: boolean;

  constructor() {
    this.minLength = false;
    this.specialCharacters = false;
    this.bigLetters = false;
    this.minDigits = false;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTabGroup) tabsGroup: MatTabGroup;
  globalSettings: GlobalSettingsModel;
  passwordRequirements: PasswordRequirementsValidation = new PasswordRequirementsValidation();
  showPasswordOnSummary = false;
  hidePassword = true;
  hidePasswordRepeat = true;

  primaryDataForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required]),
  });


  constructor(
    private authService: AuthService,
    private globalSettingsService: GlobalSettingsService,
    private toast: ToastrService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.globalSettings = await this.globalSettingsService.getGlobalSettings();
    this.passwordForm.get('password').valueChanges.subscribe((value: string) => {
      this.checkPasswordRequirements(value);
    })
  }

  ngAfterViewInit() {
    this.tabsGroup.selectedTabChange.subscribe((e: MatTabChangeEvent) => e.tab.disabled = false);
  }

  private checkPasswordRequirements(value: string) {
    this.passwordRequirements.minLength = value.length >= this.globalSettings.minLength;

    const lettersRegex = /[A-Z]/;
    this.passwordRequirements.bigLetters = value.split('')
      .filter(char => lettersRegex.test(char)).length >= this.globalSettings.bigLetters;

    const numberRegex = /[0-9]/;
    this.passwordRequirements.minDigits = value.split('')
      .filter(char => numberRegex.test(char)).length >= this.globalSettings.minDigits;

    const specialCharactersRegex = /[^a-zA-Z0-9 ]/;
    this.passwordRequirements.specialCharacters = value.split('')
      .filter(char => specialCharactersRegex.test(char)).length >= this.globalSettings.specialCharacters;
  }

  onProceed(form: FormGroup) {
    if (form.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    this.tabsGroup.selectedIndex++;
  }

  async register() {
    if (this.primaryDataForm.invalid || this.passwordForm.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    if (this.passwordForm.get('password').value !== this.passwordForm.get('passwordRepeat').value) {
      this.toast.error('Hasła nie są zgodne!');
      this.passwordForm.setErrors({ passwordNotEquals: true });
      return;
    }

    const passwordRequirementNotPassed = Object.keys(this.passwordRequirements)
      .some(property => this.passwordRequirements[property] === false);

    if (passwordRequirementNotPassed) {
      this.toast.error('Wymagania dotyczące hasła nie zostały spełnione!');
      return;
    }

    const userData: UserModel = { ...this.primaryDataForm.getRawValue(), ...this.passwordForm.getRawValue() };
    userData.id = 0;

    await this.authService.register(userData, window.location.origin + '/login/');
    this.router.navigateByUrl('/login');
  }

}
