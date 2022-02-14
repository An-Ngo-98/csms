import * as fromUserManagement from '.';
import { NgModule } from '@angular/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RoleConstant } from '../../../commons/consts/permission.const';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: fromUserManagement.UserManagementComponent,
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
export class UserManagementRoutingModule { }
