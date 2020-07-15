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

  uploadFiles(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('files', file, file.name);
    });

    return this.http.post(`${environment.apiUrl}/api/File`, formData).pipe(
      tap(() => this.toast.success('Pomyślnie dodano pliki')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  deleteFiles(filesToDeleteIds: number[]) {
    let params = new HttpParams();
    filesToDeleteIds.forEach((x: number) => {
      params = params.append('fileIds', x.toString());
    });

    return this.http.delete(`${environment.apiUrl}/api/File`, { params }).pipe(
      tap(() => this.toast.success('Pomyślnie usunięto pliki')),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

}
