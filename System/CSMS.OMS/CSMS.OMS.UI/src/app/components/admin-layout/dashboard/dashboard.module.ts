import * as fromDashboard from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

const APP_DASHBOARD_COMPONENTS: any[] = [
  fromDashboard.DashboardComponent,
];

@NgModule({
  declarations: [APP_DASHBOARD_COMPONENTS],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    NgbModule,
    CommonComponentModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class DashboardModule { }
