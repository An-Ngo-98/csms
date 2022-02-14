import * as fromPromotion from '.';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RoleConstant } from '../../../commons/consts/permission.const';

const routes: Routes = [
  {
    path: '',
    component: fromPromotion.PromotionManagementComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: RoleConstant.ADMIN,
        redirectTo: '/orders'
      }
    }
  },
  {
    path: ':id',
    component: fromPromotion.PromotionInfoComponent,
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
export class PromotionManagementRoutingModule { }
