import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { HistoryModel } from 'src/app/models/History';

@Component({
  selector: 'app-files-history',
  templateUrl: './files-history.component.html',
  styleUrls: ['./files-history.component.scss']
})
export class FilesHistoryComponent implements OnInit {
  historyData: HistoryModel[] = [];
  displayedColumns = ['actionDate', 'description', 'userData'];
  
  constructor(
    private historyService: HistoryService
  ) { }

  async ngOnInit() {
    this.historyData = await this.historyService.getHistory();
    console.log(this.historyData)
  }

}
