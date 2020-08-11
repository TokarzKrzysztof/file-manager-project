import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mobile-warning-dialog',
  templateUrl: './mobile-warning-dialog.component.html',
  styleUrls: ['./mobile-warning-dialog.component.scss']
})
export class MobileWarningDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<MobileWarningDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onAccept() {
    this.dialogRef.close();
  }
}
