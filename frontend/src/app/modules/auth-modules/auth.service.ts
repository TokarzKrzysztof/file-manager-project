import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { UserModel } from './model-UserModel';
import { ActionsService } from 'src/app/shared/services/actions.service';
import { Router } from '@angular/router';
import { PasswordChangeData } from 'src/app/shared/components/user-panel/dialogs/change-password-dialog/change-password-dialog.component';
import { translations } from 'src/app/app.component';


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
    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/Auth/GetAllUsers`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  login(email: string, password: string): Promise<UserModel> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    this.actionsService.startBackendAction();
    return this.http.post<UserModel>(`${environment.apiUrl}/api/Auth/Login`, {}, { params }).pipe(
      tap((res: UserModel) => {
        this.currentUserValue = res;
        this.toast.success(translations.LOGIN_SUCCESS);
        this.checkCurrentUserBlockades();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise().finally(() => this.actionsService.stopBackendAction());
  }

  register(registerData: UserModel, emailActivationUrl: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('emailActivationUrl', emailActivationUrl);
    params = params.append('subject', translations.REGISTER_MAIL_SUBJECT);
    params = params.append('mailContent', translations.REGISTER_MAIL_CONTENT);

    this.actionsService.startBackendAction();
    return this.http.post(`${environment.apiUrl}/api/Auth/Register`, registerData, { params }).pipe(
      tap(() => this.toast.success(translations.REGISTER_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise().finally(() => this.actionsService.stopBackendAction());
  }

  activateAccount(token: string): Promise<any> {
    const params = new HttpParams().append('token', token);

    return this.http.put(`${environment.apiUrl}/api/Auth/ActivateAccount`, {}, { params }).pipe(
      tap(() => this.toast.success(translations.ACTIVATION_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  logout(token: string, dontShowToast?: boolean): Promise<any> {
    const params = new HttpParams().append('token', token);

    return this.http.put(`${environment.apiUrl}/api/Auth/Logout`, {}, { params }).pipe(
      tap(() => {
        if (dontShowToast) {
          return;
        }
        this.toast.success(translations.LOGOUT_SUCCESS);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  deleteAccount(token: string, password: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('token', token);
    params = params.append('password', password);

    return this.http.put(`${environment.apiUrl}/api/Auth/DeleteAccount`, {}, { params }).pipe(
      tap(() => this.toast.info(translations.ACCOUNT_DELETE_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  changePassword(token: string, passwordChangeData: PasswordChangeData): Promise<any> {
    let params = new HttpParams();
    params = params.append('token', token);

    return this.http.put(`${environment.apiUrl}/api/Auth/ChangePassword`, passwordChangeData, { params }).pipe(
      tap(() => this.toast.success(translations.PASSWORD_CHANGE_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  remindPassword(email: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('subject', translations.REMIND_PASSWORD_MAIL_SUBJECT);
    params = params.append('mailContent', translations.REMIND_PASSWORD_MAIL_CONTENT);

    this.actionsService.startBackendAction();
    return this.http.put(`${environment.apiUrl}/api/Auth/RemindPassword`, {}, { params }).pipe(
      tap(() => this.toast.success(translations.PASSWORD_REMIND_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise().finally(() => this.actionsService.stopBackendAction());
  }

  getCurrentUser(token: string): Promise<UserModel> {
    const params = new HttpParams().append('token', token);

    return this.http.get<UserModel>(`${environment.apiUrl}/api/Auth/GetCurrentUser`, { params }).pipe(
      tap((res: UserModel) => {
        this.currentUserValue = res;
        this.checkCurrentUserBlockades();
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  disableUsersSystemEditing(selectedUsersIds: number[]): Promise<any> {
    let params = new HttpParams();
    selectedUsersIds.forEach((id: number) => {
      params = params.append('ids', id.toString());
    });

    return this.http.put(`${environment.apiUrl}/api/Auth/DisableUsersSystemEditing`, {}, { params }).pipe(
      tap(() => this.toast.success(translations.USERS_BLOCK_EDIT_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  disableUsersSystemAccess(selectedUsersIds: number[]): Promise<any> {
    let params = new HttpParams();
    selectedUsersIds.forEach((id: number) => {
      params = params.append('ids', id.toString());
    });

    return this.http.put(`${environment.apiUrl}/api/Auth/DisableUsersSystemAccess`, {}, { params }).pipe(
      tap(() => this.toast.success(translations.USERS_BLOCK_ACCESS_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  unlockUser(id: number): Promise<any> {
    const params = new HttpParams().append('id', id.toString());

    return this.http.put(`${environment.apiUrl}/api/Auth/UnlockUser`, {}, { params }).pipe(
      tap(() => this.toast.success(translations.USER_UNLOCK_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  searchForUsers(searchString: string): Promise<UserModel[]> {
    const params = new HttpParams().append('searchString', searchString);

    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/Auth/SearchForUsers`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  getBlockedUsers(): Promise<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/api/Auth/GetBlockedUsers`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).toPromise();
  }

  private async checkCurrentUserBlockades() {
    if (this.currentUserValue.systemEditingEnabled === false) {
      this.toast.warning(translations.BLOCKADE_WARNING);
    }

    if (this.currentUserValue.systemAccess === false) {
      await this.logout(this.currentUserValue.token, true);
      this.toast.error(translations.ACCOUNT_BLOCKED_ERROR);
      window.localStorage.removeItem('currentUserToken');
      this.clearCurrentUserValue();
      this.router.navigateByUrl('/login');
    }
  }

}
