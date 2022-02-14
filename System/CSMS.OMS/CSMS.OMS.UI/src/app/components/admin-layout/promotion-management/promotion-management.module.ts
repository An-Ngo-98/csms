import * as fromPromotion from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { PromotionManagementRoutingModule } from './promotion-management-routing.module';
import { TagInputModule } from 'ngx-chips';
import { UiSwitchModule } from 'ngx-toggle-switch';


const APP_PROMOTION_MANAGEMENT_COMPONENTS: any[] = [
  fromPromotion.PromotionManagementComponent,
  fromPromotion.PromotionManagementComponent,
  fromPromotion.PromotionInfoComponent,
  fromPromotion.PromotionDetailsComponent,
  fromPromotion.PromotionChartsComponent,
  fromPromotion.PromotionInvoicesComponent
];

const APP_PROMOTION_MANAGEMENT_POPUP_COMPONENTS: any[] = [
  fromPromotion.PromotionPopupComponent,
];

@NgModule({
  declarations: [
    APP_PROMOTION_MANAGEMENT_COMPONENTS,
    APP_PROMOTION_MANAGEMENT_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    UiSwitchModule,
    FormsModule,
    NgbModule,
    PromotionManagementRoutingModule,
    CommonComponentModule,
    TagInputModule,
  ],
  entryComponents: [
    APP_PROMOTION_MANAGEMENT_POPUP_COMPONENTS
  ]
})
export class PromotionManagementModule { }
