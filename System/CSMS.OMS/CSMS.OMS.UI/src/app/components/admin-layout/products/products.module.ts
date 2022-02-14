import * as fromProducts from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ProductsRoutingModule } from './products-routing.module';
import { TagInputModule } from 'ngx-chips';
import { UiSwitchModule } from 'ngx-toggle-switch';

const APP_PRODUCTS_COMPONENTS: any[] = [
  fromProducts.ProductsComponent
];

const APP_PRODUCTS_POPUP_COMPONENTS: any[] = [
  fromProducts.ProductPopupComponent,
  fromProducts.ExportProductPopupComponent,
  fromProducts.ImportProductPopupComponent,
  fromProducts.ProductManagementComponent,
  fromProducts.CategoryManagementComponent
];

@NgModule({
  declarations: [
    APP_PRODUCTS_COMPONENTS,
    APP_PRODUCTS_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    UiSwitchModule,
    FormsModule,
    NgbModule,
    ProductsRoutingModule,
    CommonComponentModule,
    TagInputModule,
  ],
  entryComponents: [
    APP_PRODUCTS_POPUP_COMPONENTS
  ]
})
export class ProductsModule { }
