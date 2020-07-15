import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserModel } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Promise<any> {
    console.log(email, password)
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);
    
    return this.http.post(`${environment.apiUrl}/api/Auth/login`, {}, {params}).toPromise();
  }

  register(registerData: UserModel): Promise<any> {
    return this.http.post(`${environment.apiUrl}/api/Auth/register`, registerData).toPromise();
  }
}
