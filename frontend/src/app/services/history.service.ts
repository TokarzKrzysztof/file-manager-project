import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, max } from 'rxjs/operators';
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

  getHistory(page: number, pageSize: number): Promise<HistoryModel[]> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());

    return this.http.get<HistoryModel[]>(`${environment.apiUrl}/api/History`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  getHistoryCount(maxAmount: number): Promise<number> {
    const params = new HttpParams().append('maxAmount', maxAmount.toString());

    return this.http.get<number>(`${environment.apiUrl}/api/History/count`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

}
