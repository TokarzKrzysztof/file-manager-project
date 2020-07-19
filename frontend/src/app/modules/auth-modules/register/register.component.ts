import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../auth.service';
import { UserModel } from '../model-UserModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild(MatTabGroup) tabsGroup: MatTabGroup;
  canShowSummary: boolean;
  showPasswordOnSummary = false;
  hidePassword = true;
  hidePasswordRepeat = true;

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required])
  });


  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onProceed() {
    if (this.formGroup.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    if (this.formGroup.get('password').value !== this.formGroup.get('passwordRepeat').value) {
      this.formGroup.setErrors({passwordNotEquals: true});
      this.toast.error('Hasła nie są zgodne!');
      return;
    }

    this.canShowSummary = true;
    this.tabsGroup.selectedIndex = 1;
  }

  async register() {
    if (this.formGroup.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    const userData: UserModel = { ...this.formGroup.getRawValue() };
    userData.id = 0;

    await this.authService.register(userData, window.location.origin + '/login/');
    this.router.navigateByUrl('/login');
  }

}
