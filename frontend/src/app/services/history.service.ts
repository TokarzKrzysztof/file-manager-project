import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HistoryModel } from '../models/History';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private http: HttpClient,
    private toast: ToastrService
  ) { }

  getHistory(): Promise<HistoryModel[]>{
    return this.http.get<HistoryModel[]>(`${environment.apiUrl}/api/History`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

}
