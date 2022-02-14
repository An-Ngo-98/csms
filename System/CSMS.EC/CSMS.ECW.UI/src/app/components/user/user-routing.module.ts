import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserComponent } from './user.component';
import { AddressBookComponent } from './address-book/address-book.component';
import { FavoritedProductComponent } from './favorited-product/favorited-product.component';
import { BuyLaterProductComponent } from './buy-later-product/buy-later-product.component';
import { CommentComponent } from './comment/comment.component';
const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'order-management',
        component: OrderManagementComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'address-book',
        component: AddressBookComponent
      },
      {
        path: 'favorite-product',
        component: FavoritedProductComponent
      },
      {
        path: 'buy-later-product',
        component: BuyLaterProductComponent
      },
      {
        path: 'comment',
        component: CommentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
