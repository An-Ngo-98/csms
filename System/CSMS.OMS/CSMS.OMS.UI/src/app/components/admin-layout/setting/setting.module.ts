import * as fromSetting from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { SettingRoutingModule } from './setting-routing.module';

const APP_SETTING_COMPONENTS: any[] = [
  fromSetting.SettingComponent,
  fromSetting.DefaultFilesComponent,
  fromSetting.InterfaceComponent,
  fromSetting.ReportsComponent,
  fromSetting.PaymentsComponent,
  fromSetting.DeliveriesComponent
];

const APP_SETTING_POPUP_COMPONENTS: any[] = [];

@NgModule({
  declarations: [
    APP_SETTING_COMPONENTS,
    APP_SETTING_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    SettingRoutingModule,
    CommonComponentModule,
  ],
  entryComponents: [
    APP_SETTING_POPUP_COMPONENTS
  ]
})
export class SettingModule { }
