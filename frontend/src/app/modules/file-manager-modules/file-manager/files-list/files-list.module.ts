import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesListComponent } from './files-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FoldersComponent } from './folders/folders.component';
import { FoldersDialogComponent } from './folders/dialogs/folders-dialog/folders-dialog.component';
import { ActiveActionGuard } from 'src/app/shared/guards/active-action.guard';

const routes: Routes = [
  { path: '', component: FilesListComponent, canDeactivate: [ActiveActionGuard]},
];

@NgModule({
  declarations: [FilesListComponent, FoldersComponent, FoldersDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class FilesListModule { }
