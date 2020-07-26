import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { translations } from 'src/app/app.component';

@Component({
  selector: 'app-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss']
})
export class RemindPasswordComponent implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async onRemindPassword() {
    if (this.formGroup.invalid) {
      this.toast.error(translations.INCORRECT_EMAIL_ERROR);
      return;
    }

    const email: string = this.formGroup.get('email').value;
    await this.authService.remindPassword(email);
    this.router.navigateByUrl('/login');
  }

}
