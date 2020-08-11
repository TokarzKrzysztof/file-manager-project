import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesListComponent } from './files-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FoldersComponent } from './folders/folders.component';
import { FoldersDialogComponent } from './folders/dialogs/folders-dialog/folders-dialog.component';
import { ActiveActionGuard } from 'src/app/shared/guards/active-action.guard';
import { ShareFileDialogComponent } from './dialogs/share-file-dialog/share-file-dialog.component';
import { DiscSpaceComponent } from './components/disc-space/disc-space.component';

const routes: Routes = [
  { path: '', component: FilesListComponent, canDeactivate: [ActiveActionGuard]},
];

@NgModule({
  declarations: [FilesListComponent, FoldersComponent, FoldersDialogComponent, ShareFileDialogComponent, DiscSpaceComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class FilesListModule { }
