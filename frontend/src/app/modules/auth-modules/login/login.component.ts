import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserModel } from '../model-UserModel';
import { translations } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      if (params?.token) {
        await this.authService.activateAccount(params.token);
        this.router.navigateByUrl('/login');
      }
    });
  }

  async login() {
    if (this.formGroup.invalid) {
      this.toast.error(translations.FILL_ALL_FIELDS);
      return;
    }

    const currentUser: UserModel = await this.authService.login(this.formGroup.get('email').value, this.formGroup.get('password').value);
    window.localStorage.setItem('currentUserToken', currentUser.token);
    this.router.navigateByUrl('/file-manager');
  }
}
