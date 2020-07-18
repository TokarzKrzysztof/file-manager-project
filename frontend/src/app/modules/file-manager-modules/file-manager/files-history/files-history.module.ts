import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesHistoryComponent } from './files-history.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const routes: Routes = [
  { path: '', component: FilesHistoryComponent},
];

@NgModule({
  declarations: [FilesHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class FilesHistoryModule { }
