import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { GlobalSettingsModel } from './model-GlobalSettingsModel';
import { environment } from 'src/environments/environment';
import { ActionsService } from 'src/app/shared/services/actions.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {
  private globalSettings: GlobalSettingsModel;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private actionsService: ActionsService
  ) { }

  getGlobalSettings(): Promise<GlobalSettingsModel> {
    return new Promise((resolve) => {
      resolve(this.globalSettings ? this.globalSettings : this.getGlobalSettingsFromApi());
    });
  }

  private getGlobalSettingsFromApi(): Promise<GlobalSettingsModel> {
    return this.http.get<GlobalSettingsModel>(`${environment.apiUrl}/api/GlobalSettings`).pipe(
      tap((res: GlobalSettingsModel) => this.globalSettings = res),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  setGlobalSettings(settings: GlobalSettingsModel): Promise<any> {
    this.actionsService.startAction();
    return this.http.put(`${environment.apiUrl}/api/GlobalSettings`, settings).pipe(
      tap(() => this.toast.success('Pomyślnie zaktualizowano ustawienia')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }
}
