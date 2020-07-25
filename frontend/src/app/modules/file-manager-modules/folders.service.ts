import { Injectable } from '@angular/core';
import { FolderModel } from './model-FolderModel';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActionsService } from 'src/app/shared/services/actions.service';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { translations } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private actionsService: ActionsService
  ) { }

  getFoldersTree(): Promise<FolderModel[]> {
    return this.http.get<FolderModel[]>(`${environment.apiUrl}/api/Folders/GetFoldersTree`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  searchForFolders(searchString: string): Promise<FolderModel[]> {
    const params = new HttpParams().append('searchString', searchString);

    return this.http.get<FolderModel[]>(`${environment.apiUrl}/api/Folders/SearchForFolders`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  createFolder(folderData: FolderModel): Promise<number> {
    this.actionsService.startAction();
    return this.http.post<number>(`${environment.apiUrl}/api/Folders/CreateFolder`, folderData).pipe(
      tap(() => this.toast.success(translations.FOLDER_ADD_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }

  updateFolder(folderData: FolderModel): Promise<void> {
    this.actionsService.startAction();
    return this.http.put<void>(`${environment.apiUrl}/api/Folders/UpdateFolder`, folderData).pipe(
      tap(() => this.toast.success(translations.FOLDER_UPDATE_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }

  deleteFolder(id: number): Promise<void> {
    const params = new HttpParams().append('id', id.toString());

    this.actionsService.startAction();
    return this.http.put<void>(`${environment.apiUrl}/api/Folders/DeleteFolder`, {}, { params }).pipe(
      tap(() => this.toast.success(translations.FOLDER_DELETE_SUCCESS)),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise().finally(() => this.actionsService.stopAction());
  }
}
