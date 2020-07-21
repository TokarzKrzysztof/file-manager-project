import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HistoryService } from '../../history.service';
import { HistoryModel } from '../../model-HistoryModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  dateRange = new FormGroup({
    start: new FormControl(null, [Validators.required]),
    end: new FormControl(null, [Validators.required])
  });

  constructor(
    private historyService: HistoryService,
    private toast: ToastrService
  ) { }

  async ngOnInit() {
    this.historyCount = await this.historyService.getHistoryCount(500);
  }

  async ngAfterViewInit() {
    this.dataSource.data = await this.historyService.getHistory(this.paginator.pageIndex + 1, this.paginator.pageSize);
  }

  async onFilter() {
    if (this.dateRange.invalid) {
      this.toast.error('Wpisz poprawne daty!');
      return;
    }

    this.dataSource.data = await this.historyService.getHistory(1, this.paginator.pageSize, this.dateRange.value);
    this.historyCount = await this.historyService.getHistoryCount(500, this.dateRange.value);
    this.paginator.firstPage();
  }

  async clearFilter() {
    this.dateRange.reset();
    this.dataSource.data = await this.historyService.getHistory(1, this.paginator.pageSize);
    this.historyCount = await this.historyService.getHistoryCount(500);
    this.paginator.firstPage();
  }

  async onPageChange(e: PageData) {
    const page = e.pageIndex + 1;
    const pageSize = e.pageSize;
    this.dataSource.data = await this.historyService.getHistory(page, pageSize, this.dateRange.valid ? this.dateRange.value : null);
  }
}
