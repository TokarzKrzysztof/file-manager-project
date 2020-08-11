import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileWarningComponent } from './mobile-warning.component';
import { SharedModule } from '../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: MobileWarningComponent
  }
];


@NgModule({
  declarations: [MobileWarningComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MobileWarningModule { }