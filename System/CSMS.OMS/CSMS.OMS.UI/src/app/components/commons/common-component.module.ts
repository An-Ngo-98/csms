import { CommonComponents, CommonPopupComponents } from './common-component.declaration';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BootstrapModalModule } from 'angularx-bootstrap-modal';

const APP_COMMON_COMPONENTS: any[] = [
  CommonComponents
];
const APP_COMMON_POPUP_COMPONENTS: any[] = [
  CommonPopupComponents
];

@NgModule({
  declarations: [
    APP_COMMON_COMPONENTS,
    APP_COMMON_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    BootstrapModalModule,
  ],
  exports: [
    APP_COMMON_COMPONENTS
  ],
  entryComponents: [
    APP_COMMON_POPUP_COMPONENTS
  ],
})
export class CommonComponentModule { }
