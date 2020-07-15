import { Component, OnInit, Renderer2 } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { FilesService } from '../../services/files.service';
import { ToastrService } from 'ngx-toastr';
import { FileModel } from 'src/app/models/File';
import { DomSanitizer } from '@angular/platform-browser';

interface FileResponse {
  contentType: string;
  enableRangeProcessing: boolean;
  entityTag: any;
  fileContents: string;
  fileDownloadName: string;
  lastModified: Date
}

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'fileName', 'uploadTime', 'size'];
  dataSource = new MatTableDataSource<FileModel>();
  selection = new SelectionModel<FileModel>(true, []);

  preparedFiles: File[] = [];

  constructor(
    private filesService: FilesService,
    private toast: ToastrService,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadFiles();
  }

  async loadFiles() {
    this.dataSource.data = await this.filesService.getFiles();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onFileUpload(e) {
    this.preparedFiles = (Array.from(e.target.files) as File[]).concat(this.preparedFiles);
  }

  async onFilesSend() {
    try {
      await this.filesService.uploadFiles(this.preparedFiles);
      this.toast.success('Pomyślnie dodano pliki');
      this.preparedFiles = [];
      this.loadFiles();
    }
    catch (ex) {
      console.error(ex);
      this.toast.error('Podczas wysyłania plików wystąpił błąd');
    }
  }

  async onDeleteFiles() {
    const selectedFiles: FileModel[] = this.selection.selected;
    if (selectedFiles.length === 0) {
      return;
    }

    const filesToDeleteIds = selectedFiles.map(x => x.id);
    await this.filesService.deleteFiles(filesToDeleteIds);
    this.loadFiles();
  }

  async onDownloadFiles() {
    const selectedFiles: FileModel[] = this.selection.selected;
    if (selectedFiles.length === 0) {
      return;
    }

    const filesToDownloadIds = selectedFiles.map(x => x.id);
    for (const id of filesToDownloadIds) {
      const fileBlob = new Blob([await this.filesService.downloadFile(id) as BlobPart], {type: 'image/png'})
      const fileUrl = URL.createObjectURL(fileBlob);
      const anchorTag: HTMLAnchorElement = this.renderer.createElement('a');
      console.log(fileUrl)
      anchorTag.href = fileUrl;
      anchorTag.download = 'plan1.png';
      // anchorTag.click();
      anchorTag.remove();
    }
  }

}
