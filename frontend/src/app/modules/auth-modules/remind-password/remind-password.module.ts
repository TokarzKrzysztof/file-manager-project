import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RemindPasswordComponent} from './remind-password.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RemindPasswordComponent },
];

@NgModule({
  declarations: [RemindPasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [RemindPasswordComponent]
})
export class RemindPasswordModule { }
