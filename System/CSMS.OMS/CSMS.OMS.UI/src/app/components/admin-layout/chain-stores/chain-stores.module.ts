import * as fromChainStores from '.';
import { AgmCoreModule } from '@agm/core';
import { ChainStoresRoutingModule } from './chain-stores-routing.module';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { UserManagementModule } from '../user-management/user-management.module';

const APP_CHAIN_STORES_COMPONENTS: any[] = [
    fromChainStores.ChainStoresComponent,
    fromChainStores.StoreManagementComponent,
    fromChainStores.StoreProductsManagementComponent,
    fromChainStores.StoreDetailComponent,
    fromChainStores.StoreInformationComponent,
    fromChainStores.StoreWarehouseComponent,
    fromChainStores.StoreEmployeeComponent,
];

const APP_CHAIN_STORES_POPUP_COMPONENTS: any[] = [
    fromChainStores.AddEditStorePopupComponent,
    fromChainStores.SelectPositionMapPopupComponent,
];

@NgModule({
    declarations: [
        APP_CHAIN_STORES_COMPONENTS,
        APP_CHAIN_STORES_POPUP_COMPONENTS
    ],
    imports: [
        UiSwitchModule,
        ChainStoresRoutingModule,
        CommonModule,
        FormsModule,
        NgbModule,
        CommonComponentModule,
        UserManagementModule,
        DragDropModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAqVlPCEiAhBCIzqyAsOxlXAEDtHV7wdOE',
            libraries: ['places']
        }),
    ], entryComponents: [
        APP_CHAIN_STORES_POPUP_COMPONENTS
    ]
})
export class ChainStoresModule { }
