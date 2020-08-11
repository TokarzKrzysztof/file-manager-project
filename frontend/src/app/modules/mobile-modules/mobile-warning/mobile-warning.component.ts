import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-warning',
  templateUrl: './mobile-warning.component.html',
  styleUrls: ['./mobile-warning.component.scss']
})
export class MobileWarningComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.dataService.getIsMobile() === false) {
      this.router.navigateByUrl('/file-manager')
    }
  }

}
