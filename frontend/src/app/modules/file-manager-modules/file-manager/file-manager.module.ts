import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: FileManagerComponent, children: [
      { path: '', redirectTo: 'files', pathMatch: 'full' },
      {
        path: 'files',
        loadChildren: () => import('./files-list/files-list.module').then(m => m.FilesListModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./files-history/files-history.module').then(m => m.FilesHistoryModule)
      }
    ]
  }
];

@NgModule({
  declarations: [FileManagerComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [FileManagerComponent]
})
export class FileManagerModule { }
