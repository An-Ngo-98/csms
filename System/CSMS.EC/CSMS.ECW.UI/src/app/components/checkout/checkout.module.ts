import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatTableModule, MatPaginatorModule, MatIconModule, MatSelectModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SignUpComponent } from '../authentication/sign-up/sign-up.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { InformationPaymentComponent } from './information-payment/information-payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChooseVouchersComponent } from 'app/modals/choose-vouchers/choose-vouchers.component';
import { NewAddressComponent } from 'app/modals/new-address/new-address.component';
import { DetailsOrderComponent } from './details-order/details-order.component';
import { NgxLoadingModule } from 'ngx-loading';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
const CHECKOUT_COMPONENTS: any[] = [
  CartComponent,
  PaymentComponent,
  InformationPaymentComponent,
  ChooseVouchersComponent,
  NewAddressComponent,
  DetailsOrderComponent
];

@NgModule({
  declarations: [
    CHECKOUT_COMPONENTS,
    DetailsOrderComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, MatMomentDateModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    CheckoutRoutingModule,
    SharedModule,
    MatTabsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxLoadingModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  exports: [
    CHECKOUT_COMPONENTS
  ],
  entryComponents: [
    // InformationPaymentComponent,
    ChooseVouchersComponent,
    NewAddressComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
]
})
export class CheckoutModule { }
