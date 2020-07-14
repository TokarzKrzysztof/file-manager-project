import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/register/register.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { DeletedFilesComponent } from './components/deleted-files/deleted-files.component';


const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'file-manager', component: FileManagerComponent },
  { path: 'deleted-files', component: DeletedFilesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
