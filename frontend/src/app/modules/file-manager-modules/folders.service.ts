import { Injectable } from '@angular/core';
import { FolderModel } from './model-FolderModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActionsService } from 'src/app/shared/services/actions.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private actionsService: ActionsService
  ) { }

  getFolders(): Promise<FolderModel[]> {
    return this.http.get<FolderModel[]>(`${environment.apiUrl}/api/Folders`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  createFolder(folderData: FolderModel): Promise<void> {
    this.actionsService.startAction();
    return this.http.post<void>(`${environment.apiUrl}/api/Folders`, folderData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }

  updateFolder(folderData: FolderModel): Promise<void> {
    this.actionsService.startAction();
    return this.http.put<void>(`${environment.apiUrl}/api/Folders`, folderData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }
}
