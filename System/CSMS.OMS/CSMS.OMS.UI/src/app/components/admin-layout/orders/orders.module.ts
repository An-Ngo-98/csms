import * as fromOrders from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

const APP_ORDERS_COMPONENTS: any[] = [
  fromOrders.OrdersComponent,
];

const APP_ORDERS_POPUP_COMPONENTS: any[] = [
  fromOrders.NewOrderComponent
];

@NgModule({
  declarations: [APP_ORDERS_COMPONENTS, APP_ORDERS_POPUP_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    OrdersRoutingModule,
    CommonComponentModule,
    NgxPermissionsModule.forChild(),
  ],
  entryComponents: [
    APP_ORDERS_POPUP_COMPONENTS
  ]
})
export class OrdersModule { }
