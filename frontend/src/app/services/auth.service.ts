import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/User';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { ActionsService } from './actions.service';
import { PasswordChangeData } from '../dialogs/change-password-dialog/change-password-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserValue: UserModel = null;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private actionsService: ActionsService
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

    this.actionsService.startAction();
    return this.http.post<string>(`${environment.apiUrl}/api/Auth/login`, {}, { params }).pipe(
      tap(() => this.toast.success('Zalogowano pomyślnie')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }

  register(registerData: UserModel, emailActivationUrl: string): Promise<any> {
    const params = new HttpParams().append('emailActivationUrl', emailActivationUrl);

    this.actionsService.startAction();
    return this.http.post(`${environment.apiUrl}/api/Auth/register`, registerData, { params }).pipe(
      tap(() => this.toast.success('Zarejestrowano w systemie, sprawdź swoją skrzynkę pocztową aby aktywować konto')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }

  activateAccount(token: string) {
    const params = new HttpParams().append('token', token);

    return this.http.put(`${environment.apiUrl}/api/Auth/activateAccount`, {}, { params }).pipe(
      tap(() => this.toast.success('Konto zostało aktywowane, możesz się teraz zalogować')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  logout(token: string): Promise<any> {
    const params = new HttpParams().append('token', token);

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

  deleteAccount(token: string, password: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('token', token);
    params = params.append('password', password);

    return this.http.put(`${environment.apiUrl}/api/Auth/deleteAccount`, {}, { params }).pipe(
      tap(() => this.toast.info('Konto zostało usunięte')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  changePassword(token: string, passwordChangeData: PasswordChangeData): Promise<any> {
    let params = new HttpParams();
    params = params.append('token', token);

    return this.http.put(`${environment.apiUrl}/api/Auth/changePassword`, passwordChangeData, { params }).pipe(
      tap(() => this.toast.success('Hasło zostało zmienione')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  remindPassword(email: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('email', email);

    this.actionsService.startAction();
    return this.http.put(`${environment.apiUrl}/api/Auth/remindPassword`, {}, { params }).pipe(
      tap(() => this.toast.success('Twoje nowe hasło zostało wysłane na podanego maila')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }

  getCurrentUser(token: string): Promise<UserModel> {
    const params = new HttpParams().append('token', token);

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
