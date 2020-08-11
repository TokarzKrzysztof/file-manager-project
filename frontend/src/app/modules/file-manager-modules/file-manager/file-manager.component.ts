import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
})
export class FileManagerComponent implements OnInit {
  isMobile: boolean;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.isMobile = this.dataService.getIsMobile();
  }

}
