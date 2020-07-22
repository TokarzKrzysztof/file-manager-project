import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FolderModel } from 'src/app/modules/file-manager-modules/model-FolderModel';

export interface AddFolderData {
  title: string;
  withParent: boolean;
  editingFolder: FolderModel;
  parentId?: number;
}

@Component({
  selector: 'app-folders-dialog',
  templateUrl: './folders-dialog.component.html',
  styleUrls: ['./folders-dialog.component.scss']
})
export class FoldersDialogComponent implements OnInit {
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
    if (this.data.withParent) {
      this.formGroup.get('parentId').setValidators(Validators.required);
    }
  }

  onAccept() {
    if (this.formGroup.invalid) {
      this.toast.error('Wypełnij poprawnie wszystkie pola!');
      return;
    }

    const folderData: FolderModel = this.formGroup.getRawValue() as FolderModel;
    if (this.data.editingFolder) {
      folderData.id = this.data.editingFolder.id;
    } else {
      folderData.id = 0;
    }

    this.dialogRef.close(folderData);
  }

  onCancel() {
    this.dialogRef.close(null)
  }
}
