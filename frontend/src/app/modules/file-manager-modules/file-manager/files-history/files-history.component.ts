import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HistoryService } from '../../history.service';
import { HistoryModel } from '../../model-HistoryModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

interface PageData {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Component({
  selector: 'app-files-history',
  templateUrl: './files-history.component.html',
  styleUrls: ['./files-history.component.scss']
})
export class FilesHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  historyCount = 0;
  dataSource = new MatTableDataSource<HistoryModel>();
  displayedColumns = ['actionDate', 'description', 'userData'];

  constructor(
    private historyService: HistoryService
  ) { }

  async ngOnInit() {
    this.historyCount = await this.historyService.getHistoryCount(500);
  }

  async ngAfterViewInit() {
    this.dataSource.data = await this.historyService.getHistory(this.paginator.pageIndex + 1, this.paginator.pageSize);
  }

  async onPageChange(e: PageData) {
    const page = e.pageIndex + 1;
    const pageSize = e.pageSize;
    this.dataSource.data = await this.historyService.getHistory(page, pageSize);
  }
}
