import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ActiveActionGuard } from '../../../shared/guards/active-action.guard';

const routes: Routes = [
  { path: '', component: RegisterComponent, canDeactivate: [ActiveActionGuard] },
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
})
export class RegisterModule { }
