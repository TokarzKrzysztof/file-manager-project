import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { UserModel } from 'src/app/models/User';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

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
    })
  }

  async login() {
    if (this.formGroup.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    const userToken: string = await this.authService.login(this.formGroup.get('email').value, this.formGroup.get('password').value);
    await this.authService.getCurrentUser(userToken);
    window.localStorage.setItem('currentUserToken', userToken);
    this.router.navigateByUrl('/file-manager');
  }


}
