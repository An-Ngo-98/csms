import * as fromUser from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { UserInfoRoutingModule } from './user-info-routing.module';

const APP_USER_INFO_COMPONENTS: any[] = [
  fromUser.UserInfoComponent,
  fromUser.UserPersonalDetailsComponent,
];

const APP_USER_INFO_POPUP_COMPONENTS: any[] = [
  fromUser.UserAddressPopupComponent,
  fromUser.ChangePasswordPopupComponent
];

@NgModule({
  declarations: [
    APP_USER_INFO_COMPONENTS,
    APP_USER_INFO_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    UserInfoRoutingModule,
    CommonComponentModule,
  ],
  entryComponents: [
    APP_USER_INFO_POPUP_COMPONENTS
  ]
})
export class UserInfoModule { }
