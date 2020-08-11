import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class MobileGuard implements CanActivate {

  constructor(
    private dataService: DataService
  ) {
  }

  canActivate(): boolean {
    const isMobile = this.dataService.getIsMobile();
    return isMobile ? false : true;
  }
  
}
