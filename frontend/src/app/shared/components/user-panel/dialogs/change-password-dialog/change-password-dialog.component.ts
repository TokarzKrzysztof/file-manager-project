import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { translations } from 'src/app/app.component';

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  formGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    newPasswordRepeat: new FormControl('', [Validators.required])
  });

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onAccept() {
    if (this.formGroup.invalid) {
      this.toast.error(translations.FILL_ALL_FIELDS);
      return;
    }

    if (this.formGroup.get('newPassword').value !== this.formGroup.get('newPasswordRepeat').value) {
      this.toast.error('Hasła nie są zgodne!');
      return;
    }

    this.dialogRef.close(this.formGroup.getRawValue() as PasswordChangeData);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
