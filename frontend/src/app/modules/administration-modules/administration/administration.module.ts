import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '', component: AdministrationComponent, children: [
      {path: '', redirectTo: 'users-list', pathMatch: 'full'},
      {
        path: 'users-list',
        loadChildren: () => import('./users-list/users-list.module').then(m => m.UsersListModule)
      },
      {
        path: 'global-settings',
        loadChildren: () => import('./global-settings/global-settings.module').then(m => m.GlobalSettingsModule)
      }
    ]
  },
];

@NgModule({
  declarations: [AdministrationComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class AdministrationModule { }
