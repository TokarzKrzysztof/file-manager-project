import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/register/register.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { FilesHistoryComponent } from './components/files-history/files-history.component';
import { FilesListComponent } from './components/files-list/files-list.component';
import {AuthGuard} from './guards/auth.guard';
import { RemindPasswordComponent } from './components/remind-password/remind-password.component';


const routes: Routes = [
  { path: '', redirectTo: 'file-manager', pathMatch: 'full' },
  { path: 'login/:token', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'remind-password', component: RemindPasswordComponent },
  {
    path: 'file-manager', component: FileManagerComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'files', pathMatch: 'full' },
      { path: 'files', component: FilesListComponent },
      { path: 'history', component: FilesHistoryComponent }
    ]
  },
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
