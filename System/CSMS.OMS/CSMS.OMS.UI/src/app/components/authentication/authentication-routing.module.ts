import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as fromAuthen from '.';
import { LoginGuard } from '../../guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: fromAuthen.LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
