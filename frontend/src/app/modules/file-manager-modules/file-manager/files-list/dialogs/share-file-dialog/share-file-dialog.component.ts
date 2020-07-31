import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { translations } from 'src/app/app.component';
import { startWith } from 'rxjs/operators';
import { FileModel } from 'src/app/modules/file-manager-modules/model-FileModel';
import { FilesService } from 'src/app/modules/file-manager-modules/files.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-file-dialog',
  templateUrl: './share-file-dialog.component.html',
  styleUrls: ['./share-file-dialog.component.scss']
})
export class ShareFileDialogComponent implements OnInit {
  generatedLink: string;

  formGroup = new FormGroup({
    isRestricted: new FormControl(false),
    filePassword: new FormControl('', [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<ShareFileDialogComponent>,
    private toast: ToastrService,
    private filesService: FilesService,
    private snackbar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: FileModel
  ) { }

  ngOnInit(): void {
    this.formGroup.get('isRestricted').valueChanges.pipe(
      startWith(this.formGroup.get('isRestricted').value)
    ).subscribe((value: boolean) => {
      const action = value ? 'enable' : 'disable';
      this.formGroup.get('filePassword')[action]();
    })
  }

  onLinkCopy() {
    navigator.clipboard.writeText(this.generatedLink).then(() => {
      this.snackbar.open(translations.LINK_COPIED, '', { duration: 2000 });
    })
  }

  onGenerateNewLink() {
    this.generatedLink = null;
    this.formGroup.patchValue({
      isRestricted: false,
      filePassword: '',
    });
  }

  async onAccept() {
    if (this.formGroup.invalid) {
      this.toast.error(translations.FILL_ALL_FIELDS);
      return;
    }

    const filePasswordForm: FormControl = this.formGroup.get('filePassword') as FormControl;
    const linkGuidId: string = await this.filesService.createShareableLink(this.data.id, filePasswordForm.enabled ? filePasswordForm.value : null);
    this.generatedLink = `${window.location.origin}/file-share/${linkGuidId}`;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
