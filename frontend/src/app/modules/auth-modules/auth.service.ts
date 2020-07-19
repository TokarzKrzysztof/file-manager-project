import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from './model-UserModel';
import { ActionsService } from 'src/app/shared/services/actions.service';
import { PasswordChangeData } from '../file-manager-modules/dialogs/change-password-dialog/change-password-dialog.component';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserValue: UserModel = null;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private actionsService: ActionsService,
    private router: Router
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

  getAllUsers(): Promise<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/Auth/getAllUsers`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  login(email: string, password: string): Promise<UserModel> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    this.actionsService.startAction();
    return this.http.post<UserModel>(`${environment.apiUrl}/api/Auth/login`, {}, { params }).pipe(
      tap((res: UserModel) => {
        this.currentUserValue = res;
        this.toast.success('Zalogowano pomyślnie');
        this.checkCurrentUserBlockades();
      }),
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

  activateAccount(token: string): Promise<any> {
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

  logout(token: string, dontShowToast?: boolean): Promise<any> {
    const params = new HttpParams().append('token', token);

    return this.http.put(`${environment.apiUrl}/api/Auth/logout`, {}, { params }).pipe(
      tap(() => {
        if (dontShowToast) {
          return;
        }
        this.toast.success('Wylogowano pomyślnie');
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
      tap((res: UserModel) => {
        this.currentUserValue = res;
        this.checkCurrentUserBlockades();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  disableUsersSystemEditing(selectedUsersIds: number[]): Promise<any> {
    let params = new HttpParams();
    selectedUsersIds.forEach((id: number) => {
      params = params.append('ids', id.toString());
    });

    return this.http.put(`${environment.apiUrl}/api/Auth/disableUsersSystemEditing`, {}, { params }).pipe(
      tap(() => this.toast.success('Zablokowano możliwość edycji przez wybranych użytkowników')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  disableUsersSystemAccess(selectedUsersIds: number[]): Promise<any> {
    let params = new HttpParams();
    selectedUsersIds.forEach((id: number) => {
      params = params.append('ids', id.toString());
    });

    return this.http.put(`${environment.apiUrl}/api/Auth/disableUsersSystemAccess`, {}, { params }).pipe(
      tap(() => this.toast.success('Zablokowano dostęp do systemu dla wybranych użytkowników')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  unlockUser(id: number): Promise<any> {
    const params = new HttpParams().append('id', id.toString());

    return this.http.put(`${environment.apiUrl}/api/Auth/unlockUser`, {}, { params }).pipe(
      tap(() => this.toast.success('Użytkownik został odblokowany')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  searchForUsers(searchString: string): Promise<UserModel[]> {
    const params = new HttpParams().append('searchString', searchString);

    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/Auth/searchForUsers`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  getBlockedUsers(): Promise<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/Auth/getBlockedUsers`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  private async checkCurrentUserBlockades() {
    if (this.currentUserValue.systemEditingEnabled === false) {
      this.toast.warning('Możliwość dodawania, edycji i usuwania plików została dla Ciebie zablokowana');
    }

    if (this.currentUserValue.systemAccess === false) {
      await this.logout(this.currentUserValue.token, true);
      this.toast.error('Twoje konto zostało zablokowane');
      window.localStorage.removeItem('currentUserToken');
      this.clearCurrentUserValue();
      this.router.navigateByUrl('/login');
    }
  }

}
