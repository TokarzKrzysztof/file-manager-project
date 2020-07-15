import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserModel} from '../../models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordRepeat: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
    ) { }

  ngOnInit() {
  }

   async register() {
    if (this.formGroup.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }
    
    const userData: UserModel = {...this.formGroup.getRawValue()};
    userData.id = 0;

    await this.authService.register(userData);
    this.router.navigateByUrl('/login');
  }
  
}
