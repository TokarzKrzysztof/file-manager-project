import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileShareComponent } from './file-share.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: FileShareComponent
  }
];

@NgModule({
  declarations: [FileShareComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FileShareModule { }
