import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FileModel } from '../models/File';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(
    private http: HttpClient,
    private toast: ToastrService
  ) { }

  getFiles(): Promise<FileModel[]> {
    return this.http.get<FileModel[]>(`${environment.apiUrl}/api/File`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  uploadFiles(files: File[], userData: string): Promise<void> {
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('files', file, file.name);
    });
    const params = new HttpParams().append('userData', userData);

    return this.http.post<void>(`${environment.apiUrl}/api/File`, formData, {params}).pipe(
      tap(() => this.toast.success('Pomyślnie dodano pliki')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  deleteFiles(filesToDeleteIds: number[], userData: string): Promise<void> {
    let params = new HttpParams();
    filesToDeleteIds.forEach((x: number) => {
      params = params.append('fileIds', x.toString());
    });
    params = params.append('userData', userData);

    return this.http.delete<void>(`${environment.apiUrl}/api/File`, { params }).pipe(
      tap(() => this.toast.success('Pomyślnie usunięto pliki')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  downloadFile(id: number): Promise<Blob> {
    const params = new HttpParams().append('fileId', id.toString());

    return this.http.get<Blob>(`${environment.apiUrl}/api/File/download`, { params, responseType: 'blob' as 'json'}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

}
