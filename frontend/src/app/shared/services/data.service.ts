import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private isMobile: boolean;

  constructor() { }

  getIsMobile(): boolean {
    return this.isMobile;
  }

  setIsMobile(isMobile: boolean) {
    this.isMobile = isMobile;
  }

}
