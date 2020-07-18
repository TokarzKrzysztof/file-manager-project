import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';



const routes: Routes = [
  { path: '', redirectTo: 'file-manager', pathMatch: 'full' },
  {
    path: 'login/:token',
    loadChildren: () => import('./modules/auth-modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/auth-modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./modules/auth-modules/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'remind-password',
    loadChildren: () => import('./modules/auth-modules/remind-password/remind-password.module').then(m => m.RemindPasswordModule)
  },
  {
    path: 'file-manager',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/file-manager-modules/file-manager/file-manager.module').then(m => m.FileManagerModule),
  },
  {
    path: 'administration',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/administration-modules/administration/administration.module').then(m => m.AdministrationModule),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
