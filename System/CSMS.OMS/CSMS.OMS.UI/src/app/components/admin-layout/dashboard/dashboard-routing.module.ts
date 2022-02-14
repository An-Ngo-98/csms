import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as fromDashboard from '.';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RoleConstant } from '../../../commons/consts/permission.const';

const routes: Routes = [
  {
    path: '',
    component: fromDashboard.DashboardComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: RoleConstant.ADMIN,
        redirectTo: '/orders'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
