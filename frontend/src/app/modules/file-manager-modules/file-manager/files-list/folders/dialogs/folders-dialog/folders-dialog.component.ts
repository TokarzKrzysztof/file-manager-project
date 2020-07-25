import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FolderModel } from 'src/app/modules/file-manager-modules/model-FolderModel';
import { Observable } from 'rxjs';
import { startWith, filter, map } from 'rxjs/operators';
import { translations } from 'src/app/app.component';


export interface DialogFolderData {
  title: string;
  flatenedFolders: { id: number, name: string }[];
  editedFolder?: { id: number, name: string };
  parentId?: number;
}

@Component({
  selector: 'app-folders-dialog',
  templateUrl: './folders-dialog.component.html',
  styleUrls: ['./folders-dialog.component.scss']
})
export class FoldersDialogComponent implements OnInit {
  filteredFolders: Observable<{ id: number, name: string }[]>;

  hasParentFolder = new FormControl(false);
  formGroup = new FormGroup({
    parentId: new FormControl(null, [Validators.required]),
    name: new FormControl('', [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<FoldersDialogComponent>,
    private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogFolderData
  ) { }

  ngOnInit(): void {
    this.filteredFolders = this.formGroup.get('parentId').valueChanges.pipe(
      startWith(''),
      filter(value => typeof value === 'string'),
      map((value: string) => this.data.flatenedFolders.filter(x => x.name.toLowerCase().includes(value.toLowerCase())))
    );

    this.hasParentFolder.valueChanges.pipe(
      startWith(this.hasParentFolder.value)
    ).subscribe((value: boolean) => {
      const action = value ? 'enable' : 'disable';
      this.formGroup.get('parentId')[action]();
    })

    if (this.data.parentId) {
      this.hasParentFolder.setValue(true);
      this.formGroup.get('parentId').setValue(this.data.parentId);
    }

    if (this.data.editedFolder) {
      this.formGroup.get('name').setValue(this.data.editedFolder.name);
      this.data.flatenedFolders = this.data.flatenedFolders.filter(x => x.id !== this.data.editedFolder.id);
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
      this.toast.error(translations.FILL_ALL_FIELDS);
      return;
    }

    const parentIdValue = this.formGroup.get('parentId').value;
    if (typeof parentIdValue === 'string' && parentIdValue !== '') {
      this.toast.error('Wybierz poprawny folder nadrzędny!');
      return;
    }

    const folderData: FolderModel = this.formGroup.value as FolderModel;
    folderData.id = this.data.editedFolder?.id || 0;

    this.dialogRef.close(folderData);
  }

  onCancel() {
    this.dialogRef.close(null)
  }
}
