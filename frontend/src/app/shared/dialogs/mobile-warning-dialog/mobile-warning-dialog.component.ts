import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mobile-warning-dialog',
  templateUrl: './mobile-warning-dialog.component.html',
  styleUrls: ['./mobile-warning-dialog.component.scss']
})
export class MobileWarningDialogComponent implements OnInit {
  disableWarning = new FormControl(false);

  constructor(
    private dialogRef: MatDialogRef<MobileWarningDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onAccept() {
    if (this.disableWarning.value === true) {
      window.localStorage.setItem('disableMobileWarning', 'true');
    }
    this.dialogRef.close();
  }
}
