import * as fromReports from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

const APP_REPORTS_COMPONENTS: any[] = [
  fromReports.ReportsComponent,
  fromReports.RevenueOverviewComponent,
  fromReports.RevenueStoreComponent,
  fromReports.RevenueCategoryComponent,
  fromReports.BestSellingProductsComponent,
  fromReports.PromotionsReportComponent,
];

const APP_REPORTS_POPUP_COMPONENTS: any[] = [

];

@NgModule({
  declarations: [
    APP_REPORTS_COMPONENTS,
    APP_REPORTS_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReportsRoutingModule,
    CommonComponentModule,
  ]
})
export class ReportsModule { }
