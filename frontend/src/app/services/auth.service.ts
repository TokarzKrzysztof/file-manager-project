import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/User';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private http: HttpClient,
    private toast: ToastrService
  ) { }



  login(email: string, password: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    return this.http.post(`${environment.apiUrl}/api/Auth/login`, {}, { params }).pipe(
      tap(() => this.toast.success('Zalogowano pomyślnie')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  register(registerData: UserModel): Promise<any> {
    return this.http.post(`${environment.apiUrl}/api/Auth/register`, registerData).pipe(
      tap(() => this.toast.success('Zarejestrowano pomyślnie')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }
}
