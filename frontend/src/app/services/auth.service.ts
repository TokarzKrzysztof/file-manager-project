import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/User';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, find } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserValue: UserModel = null;

  constructor(
    private http: HttpClient,
    private toast: ToastrService
  ) { }

  clearCurrentUserValue() {
    this.currentUserValue = null;
  }

  getCurrentUserValue(): Promise<UserModel> {
    return new Promise((resolve) => {
      if (this.currentUserValue !== null) {
        resolve(this.currentUserValue);
        return;
      }

      const currentUserToken: string = window.localStorage.getItem('currentUserToken');
      if (currentUserToken) {
        resolve(this.getCurrentUser(currentUserToken));
        return;
      }

      throw new Error('can`t get cached user data');
    });
  }

  login(email: string, password: string): Promise<string> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    return this.http.post<string>(`${environment.apiUrl}/api/Auth/login`, {}, { params }).pipe(
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

  logout(userToken: string): Promise<any> {
    const params = new HttpParams().append('token', userToken);

    return this.http.put(`${environment.apiUrl}/api/Auth/logout`, {}, { params }).pipe(
      tap(() => {
        return this.toast.success('Wylogowano pomyślnie');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  getCurrentUser(currentUserToken: string): Promise<UserModel> {
    const params = new HttpParams().append('token', currentUserToken);

    return this.http.get<UserModel>(`${environment.apiUrl}/api/Auth`, { params }).pipe(
      tap((res: UserModel) => this.currentUserValue = res),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }
}
