import * as fromInvoices from '.';
import { CommonComponentModule } from '../../commons/common-component.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

const APP_INVOICES_COMPONENTS: any[] = [
  fromInvoices.InvoicesComponent,
];

const APP_INVOICES_POPUP_COMPONENTS: any[] = [
  fromInvoices.InvoiceDetailPopupComponent,
  fromInvoices.InvoiceExportPopupComponent,
];

@NgModule({
  declarations: [
    APP_INVOICES_COMPONENTS,
    APP_INVOICES_POPUP_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    InvoicesRoutingModule,
    CommonComponentModule,
  ],
  entryComponents: [
    APP_INVOICES_POPUP_COMPONENTS
  ]
})
export class InvoicesModule { }
