import { Component, OnInit, Renderer2, ViewChild, AfterViewInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth-modules/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { UserModel } from '../../../auth-modules/model-UserModel';
import { FileModel } from '../../model-FileModel';
import { FilesService } from '../../files.service';
import { ConfirmationDialogData, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilesListComponent implements OnInit, AfterViewInit {
  currentUser: UserModel;
  displayedColumns: string[] = ['select', 'title', 'fileName', 'uploadTime', 'createdBy', 'size', 'order'];
  dataSource = new MatTableDataSource<FileModel>();
  selection = new SelectionModel<FileModel>(true, []);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<FileModel>;
  preparedFiles: File[] = [];

  constructor(
    private filesService: FilesService,
    private toast: ToastrService,
    private renderer: Renderer2,
    private authService: AuthService,
    private dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.loadFiles();
    this.currentUser = await this.authService.getCurrentUserValue();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSearch(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  sortFilesByOrder(files: FileModel[]) {
    files.sort((a, b) => {
      if (a.order === null) {
        return 1;
      }

      if (b.order === null) {
        return -1;
      }
      return a.order - b.order;
    });

    this.dataSource.data = files;
  }

  onPropertyEdit(e: KeyboardEvent, input: HTMLInputElement, element: FileModel, propertyName: string) {
    if (e.key === 'Enter') {
      input.disabled = true;
      element[propertyName] = input.value;
      this.filesService.UpdateFile(element);

      if (propertyName === 'order') {
        this.sortFilesByOrder(this.dataSource.data);
      }
    }
  }

  onEditClick(input: HTMLInputElement, previousValue: string) {
    input.disabled = !input.disabled;

    const isCancel = input.disabled === true;
    if (isCancel) {
      input.value = previousValue;
    } else {
      input.focus();
    }
  }

  removePreparedFile(file: File) {
    const deletedFileIndex = this.preparedFiles.indexOf(file);
    this.preparedFiles.splice(deletedFileIndex, 1);
  }

  async loadFiles() {
    this.dataSource.data = await this.filesService.getFiles();
    this.sortFilesByOrder(this.dataSource.data);
    this.selection.clear();
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

  checkIfFilesSizeIsCorrect(files: File[]): boolean {
    let filesSize = 0;
    files.forEach(file => filesSize += file.size);
    return filesSize <= 1073741824;
  }

  async onFilesSend() {
    if (this.checkIfFilesSizeIsCorrect(this.preparedFiles) === false) {
      this.toast.error('Maksymalna wielkość wysyłanych plików wynosi 1GB!');
      return;
    }

    const userData = `${this.currentUser.name} ${this.currentUser.surname}`;
    await this.filesService.uploadFiles(this.preparedFiles, userData);
    this.toast.success('Pomyślnie dodano pliki');
    this.preparedFiles = [];
    this.loadFiles();
  }

  async onDeleteFiles() {
    const selectedFiles: FileModel[] = this.selection.selected;
    if (selectedFiles.length === 0) {
      return;
    }

    const dialogData: ConfirmationDialogData = {
      title: 'Czy na pewno chcesz usunąć wskazane pliki? Operacja jest nieodwracalna!'
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }
      const filesToDeleteIds = selectedFiles.map(x => x.id);
      const userData = `${this.currentUser.name} ${this.currentUser.surname}`;
      await this.filesService.deleteFiles(filesToDeleteIds, userData);
      this.loadFiles();
    });
  }

  async onDownloadFiles() {
    const selectedFiles: FileModel[] = this.selection.selected;
    if (selectedFiles.length === 0) {
      return;
    }

    const filesToDownloadIds = selectedFiles.map(x => x.id);
    const anchorTag: HTMLAnchorElement = this.renderer.createElement('a');

    for (const id of filesToDownloadIds) {
      const file: Blob = await this.filesService.downloadFile(id);
      const fileUrl = URL.createObjectURL(file);
      anchorTag.href = fileUrl;
      anchorTag.download = selectedFiles.find(x => x.id === id).fileName;
      anchorTag.click();
    }

    anchorTag.remove();
  }

}