import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { InformationPaymentComponent } from './information-payment/information-payment.component';
import { DetailsOrderComponent } from './details-order/details-order.component';
const routes: Routes = [
  {
    path: 'checkout/cart',
    component: CartComponent
  },
  {
      path: 'checkout/payment',
      component: PaymentComponent
  },
  {
    path: 'checkout/information',
    component: InformationPaymentComponent
  },
  {
    path: 'order/details/:id',
    component: DetailsOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
