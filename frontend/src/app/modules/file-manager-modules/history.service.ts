import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, max } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { HistoryModel } from './model-HistoryModel';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {


  constructor(
    private http: HttpClient,
    private toast: ToastrService
  ) { }

  getHistory(page: number, pageSize: number, dateRange?: { start: Moment, end: Moment }): Promise<HistoryModel[]> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    if (dateRange) {
      params = params.append('start', dateRange.start.toJSON());
      params = params.append('end', dateRange.end.toJSON());
    }


    return this.http.get<HistoryModel[]>(`${environment.apiUrl}/api/History`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

  getHistoryCount(maxAmount: number, dateRange?: { start: Moment, end: Moment }): Promise<number> {
    let params = new HttpParams();
    params = params.append('maxAmount', maxAmount.toString());
    if (dateRange) {
      params = params.append('start', dateRange.start.toJSON());
      params = params.append('end', dateRange.end.toJSON());
    }

    return this.http.get<number>(`${environment.apiUrl}/api/History/count`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        this.toast.error(error.error.Message);
        throw new Error(error.error.Message);
      })
    ).toPromise();
  }

}
