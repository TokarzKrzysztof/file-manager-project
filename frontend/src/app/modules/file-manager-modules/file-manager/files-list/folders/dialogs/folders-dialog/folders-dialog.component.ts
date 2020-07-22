import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FolderModel } from 'src/app/modules/file-manager-modules/model-FolderModel';
import { Observable } from 'rxjs';
import { startWith, filter, map } from 'rxjs/operators';

export interface AddFolderData {
  title: string;
  editedFolderId?: number;
  parentId?: number;
  flatenedFolders?: { id: number, name: string }[];
}

@Component({
  selector: 'app-folders-dialog',
  templateUrl: './folders-dialog.component.html',
  styleUrls: ['./folders-dialog.component.scss']
})
export class FoldersDialogComponent implements OnInit {
  filteredFolders: Observable<{ id: number, name: string }[]>;

  formGroup = new FormGroup({
    parentId: new FormControl(null),
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<FoldersDialogComponent>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: AddFolderData
  ) { }

  ngOnInit(): void {
    if (this.data.parentId) {
      const parentIdForm: FormControl = this.formGroup.get('parentId') as FormControl;
      parentIdForm.setValidators(Validators.required);
      parentIdForm.setValue(this.data.parentId);

      this.filteredFolders = parentIdForm.valueChanges.pipe(
        startWith(''),
        filter(value => typeof value === 'string'),
        map((value: string) => this.data.flatenedFolders.filter(x => x.name.toLowerCase().includes(value.toLowerCase())))
      );
    }

  }

  displayFn(folderId: number): string {
    const folder: FolderModel = this.data.flatenedFolders.find(x => x.id === folderId);
    if (folder) {
      return folder.name;
    }
  }

  onAccept() {
    if (this.formGroup.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    if (typeof this.formGroup.get('parentId').value === 'string') {
      this.toast.error('Wybierz poprawny folder nadrzędny!');
      return;
    }

    const folderData: FolderModel = this.formGroup.getRawValue() as FolderModel;
    if (this.data.editedFolderId) {
      folderData.id = this.data.editedFolderId;
    } else {
      folderData.id = 0;
    }

    this.dialogRef.close(folderData);
  }

  onCancel() {
    this.dialogRef.close(null)
  }
}
