import * as fromUserManagement from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { UserManagementRoutingModule } from './user-management-routing.module';

const APP_USER_MANAGER_COMPONENTS: any[] = [
  fromUserManagement.UserManagementComponent,
  fromUserManagement.EmployeeManagementComponent,
  fromUserManagement.CustomerManagementComponent,
];

const APP_USER_MANAGER_POPUP_COMPONENTS: any[] = [
  fromUserManagement.UserExportPopupComponent,
  fromUserManagement.AddUserPopupComponent,
];

@NgModule({
  declarations: [
    APP_USER_MANAGER_COMPONENTS,
    APP_USER_MANAGER_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    UserManagementRoutingModule,
    CommonComponentModule,
  ],
  exports: [
    fromUserManagement.EmployeeManagementComponent
  ],
  entryComponents: [
    APP_USER_MANAGER_POPUP_COMPONENTS
  ]
})
export class UserManagementModule { }
