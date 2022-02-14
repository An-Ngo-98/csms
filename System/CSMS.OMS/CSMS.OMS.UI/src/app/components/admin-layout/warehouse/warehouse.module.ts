import * as fromWarehouse from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { WarehouseRoutingModule } from './warehouse.routing';
import { UiSwitchModule } from 'ngx-toggle-switch';

const APP_WAREHOUSE_COMPONENTS: any[] = [
    fromWarehouse.WarehouseComponent,
    fromWarehouse.MaterialComponent,
    fromWarehouse.PartnerComponent,
    fromWarehouse.SpendingBillComponent,
    fromWarehouse.StockInComponent,
    fromWarehouse.StockOutComponent,
    fromWarehouse.WarehouseManagementComponent,
    fromWarehouse.PartnerInfoComponent,
];

const APP_WAREHOUSE_POPUP_COMPONENTS: any[] = [
    fromWarehouse.AddEditMaterialPopupComponent,
    fromWarehouse.AddPartnerMaterialPopupComponent,
    fromWarehouse.ImportMaterialPopupComponent,
    fromWarehouse.ImportExportHistoryPopupComponent,
    fromWarehouse.ExportMaterialPopupComponent,
];

@NgModule({
    declarations: [
        APP_WAREHOUSE_COMPONENTS,
        APP_WAREHOUSE_POPUP_COMPONENTS
    ],
    imports: [
        CommonModule,
        UiSwitchModule,
        FormsModule,
        NgbModule,
        WarehouseRoutingModule,
        CommonComponentModule,
    ],
    entryComponents: [
        APP_WAREHOUSE_POPUP_COMPONENTS
    ]
})
export class WarehouseModule { }
