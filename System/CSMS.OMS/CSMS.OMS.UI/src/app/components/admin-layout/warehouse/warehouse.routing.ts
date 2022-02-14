import * as fromWarehouse from '.';
import { NgModule } from '@angular/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RoleConstant } from '../../../commons/consts/permission.const';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: fromWarehouse.WarehouseComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: RoleConstant.ADMIN,
                redirectTo: '/orders'
            }
        }
    },
    {
        path: 'partners/:id',
        component: fromWarehouse.PartnerInfoComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: RoleConstant.ADMIN,
                redirectTo: '/partners'
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseRoutingModule { }
