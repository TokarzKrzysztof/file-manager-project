import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss']
})
export class DeleteAccountDialogComponent implements OnInit {
  password = new FormControl();

  constructor(
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
  ) { }

  ngOnInit(): void {
  }

  onAccept() {
    this.dialogRef.close(this.password.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
