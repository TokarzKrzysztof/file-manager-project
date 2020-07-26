import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GlobalSettingsModel } from './model-GlobalSettingsModel';
import { environment } from 'src/environments/environment';
import { ActionsService } from 'src/app/shared/services/actions.service';
import { translations } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private actionsService: ActionsService
  ) { }


  getGlobalSettings(): Promise<GlobalSettingsModel> {
    return this.http.get<GlobalSettingsModel>(`${environment.apiUrl}/api/GlobalSettings/GetGlobalSettings`).pipe(
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

  setGlobalSettings(settings: GlobalSettingsModel): Promise<any> {
    this.actionsService.startAction();
    return this.http.put(`${environment.apiUrl}/api/GlobalSettings/SetGlobalSettings`, settings).pipe(
      tap(() => this.toast.success(translations.SETTINGS_UPDATE_SUCCESS)),
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
    ).toPromise().finally(() => this.actionsService.stopAction());
  }
}
