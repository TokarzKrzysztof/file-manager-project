import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation, DoCheck, ViewChildren, QueryList, ElementRef, OnDestroy } from '@angular/core';
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
import { GlobalSettingsService } from 'src/app/modules/administration-modules/global-settings.service';
import { HttpResponse, HttpUploadProgressEvent, HttpEventType, HttpErrorResponse, HttpDownloadProgressEvent } from '@angular/common/http';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { ActionsService } from 'src/app/shared/services/actions.service';
import { FolderModel } from '../../model-FolderModel';
import { translations } from 'src/app/app.component';
import { TranslateService } from '@ngx-translate/core';
import { ShareFileDialogComponent } from './dialogs/share-file-dialog/share-file-dialog.component';

interface DownloadedFile {
  id: number;
  fileName: string;
  percentageProgress: number;
  totalSize: number;
}

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilesListComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<FileModel>;
  @ViewChildren('inputOrder') orderInputs: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('inputTitle') titleInputs: QueryList<ElementRef<HTMLInputElement>>;
  onUploadCancel = new Subject<void>();
  onDownloadCancel = new Subject<void>();
  activeFolder: FolderModel;
  uploadingFiles: boolean;
  fileUploadProgress: number;
  maxFilesSize: number;
  currentUser: UserModel;
  displayedColumns: string[] = ['select', 'title', 'fileName', 'uploadTime', 'createdBy', 'size', 'order', 'actions'];
  dataSource = new MatTableDataSource<FileModel>();
  selection = new SelectionModel<FileModel>(true, []);
  preparedFiles: File[] = [];
  downloadingFiles: DownloadedFile[] = [];

  constructor(
    private filesService: FilesService,
    private toast: ToastrService,
    private renderer: Renderer2,
    private authService: AuthService,
    private dialog: MatDialog,
    private globalSettingsService: GlobalSettingsService,
    private actionsService: ActionsService,
    private translateService: TranslateService
  ) { }

  async ngOnInit() {
    this.maxFilesSize = (await this.globalSettingsService.getGlobalSettings()).maxSize;
    this.currentUser = await this.authService.getCurrentUserValue();
  }

  ngDoCheck() {
    const shouldShowConfirmation = this.preparedFiles.length || this.downloadingFiles.length ||
      this.orderInputs?.some(x => x.nativeElement.disabled === false) || this.titleInputs?.some(x => x.nativeElement.disabled === false);

    if (shouldShowConfirmation) {
      this.actionsService.startEditingAction();
    } else {
      this.actionsService.stopEditingAction();
    }
  }

  onFolderChange(folder: FolderModel) {
    this.activeFolder = folder;
    this.loadFiles(this.activeFolder.id);
  }

  async loadFiles(folderId: number) {
    this.dataSource.data = await this.filesService.getFilesInsideFolder(folderId);
    this.dataSource.sort = this.sort;
    this.sortFilesByOrder(this.dataSource.data);
    this.selection.clear();
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
      this.filesService.updateFile(element);

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
    const maxSizeInBytes = this.maxFilesSize * 1048576;
    return filesSize <= maxSizeInBytes;
  }

  onFilesSendCancel() {
    const dialogData: ConfirmationDialogData = {
      title: translations.CANCEL_UPLOAD_CONFIRMATION
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.onUploadCancel.next();
      }
    });
  }

  async onFilesSend() {
    if (this.checkIfFilesSizeIsCorrect(this.preparedFiles) === false) {
      const message: string = await this.translateService.get('MAX_FILES_SIZE_ERROR', { param: this.maxFilesSize }).toPromise();
      this.toast.error(message);
      return;
    }

    const userData = `${this.currentUser.name} ${this.currentUser.surname}`;
    const creatorId = this.currentUser.id;

    this.actionsService.startBackendAction();
    this.uploadingFiles = true;
    this.filesService.uploadFiles(this.preparedFiles, userData, creatorId, this.activeFolder.id).pipe(
      takeUntil(this.onUploadCancel),
      catchError(async (error: HttpErrorResponse) => {
        if (error.error.Data?.message === 'LIMIT_UPLOAD') {
          const message = await this.translateService.get('LIMIT_UPLOAD', { param: error.error.Data.maxFilesPerHour }).toPromise();
          this.toast.warning(message);
          return of(null);
        }
        console.error(error);
        if (error.error.Data?.message) {
          const messageTranslateCode = error.error.Data.message;
          this.toast.error(translations[messageTranslateCode]);
        } else {
          this.toast.error(translations.GENERAL_HTTP_ERROR);
        }
        throw new Error();
      })
    ).subscribe((event: HttpUploadProgressEvent) => {
      if (event === null) {
        return;
      }

      if (event.type === HttpEventType.UploadProgress) {
        this.fileUploadProgress = Number(((event.loaded / event.total) * 100).toFixed(0));
      }

      else if (event instanceof HttpResponse) {
        this.toast.success(translations.FILES_ADD_SUCCESS);
      }
    },
      () => { },
      () => {
        this.preparedFiles = [];
        this.fileUploadProgress = 0;
        this.actionsService.stopBackendAction();
        this.actionsService.stopEditingAction();
        this.uploadingFiles = false;

        this.loadFiles(this.activeFolder.id);
      });
  }

  async onDeleteFiles() {
    const selectedFiles: FileModel[] = this.selection.selected;
    if (selectedFiles.length === 0) {
      return;
    }

    const dialogData: ConfirmationDialogData = {
      title: translations.DELETE_FILES_CONFIRMATION
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
      this.loadFiles(this.activeFolder.id);
    });
  }

  async onDownloadFiles() {
    const selectedFiles: FileModel[] = this.selection.selected;
    if (selectedFiles.length === 0) {
      return;
    }

    const anchorTag: HTMLAnchorElement = this.renderer.createElement('a');


    selectedFiles.forEach((file: FileModel) => {
      const downloadedFile: DownloadedFile = {
        id: file.id,
        fileName: file.fileName,
        percentageProgress: 0,
        totalSize: file.size
      };
      this.downloadingFiles.push(downloadedFile);
    });

    this.actionsService.startBackendAction();
    for (const file of this.downloadingFiles) {
      this.filesService.downloadFile(file.id).pipe(
        takeUntil(this.onDownloadCancel),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          if (error.error.Data?.message) {
            const messageTranslateCode = error.error.Data.message;
            this.toast.error(translations[messageTranslateCode]);
          } else {
            this.toast.error(translations.GENERAL_HTTP_ERROR);
          }

          return of(null);
        })
      ).subscribe((event: HttpDownloadProgressEvent) => {
        if (event === null) {
          return;
        }

        if (event.type === HttpEventType.DownloadProgress) {
          file.percentageProgress = Number(((event.loaded / file.totalSize) * 100).toFixed(0));
        }

        else if (event instanceof HttpResponse) {
          const blob: Blob = (event as HttpResponse<Blob>).body;
          const fileUrl = URL.createObjectURL(blob);
          anchorTag.href = fileUrl;
          anchorTag.download = file.fileName;
          anchorTag.click();
        }
      },
        () => { },
        () => {
          this.downloadingFiles = this.downloadingFiles.filter(x => x !== file);

          if (this.downloadingFiles.length === 0) {
            // on files download complete
            this.actionsService.stopBackendAction();
            anchorTag.remove();
            this.selection.clear();
          }
        });
    }

  }

  onShareFile(file: FileModel) {
    this.dialog.open(ShareFileDialogComponent, {
      data: file
    });
  }

  ngOnDestroy() {
    this.onUploadCancel.next();
    this.onUploadCancel.complete();
    this.onDownloadCancel.next();
    this.onDownloadCancel.complete();
  }

}
