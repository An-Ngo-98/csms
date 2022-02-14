import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { PaymentComponent } from '../payment/payment.component';
import { InformationPaymentComponent } from '../information-payment/information-payment.component';
import { Store, select } from '@ngrx/store';
import { AppState, DeleteProductFromCart, BuyLaterProduct,
  EditCountProductFromCart, GetAddress, GetInfoFromToken, VoucherActionTypes, ChooseVoucherSuccess } from 'app/store';
import { cartSelector } from 'app/store/reducers/cart.reducer';
import { Product } from 'app/models/product.model';
import { get } from 'lodash';
import { FormGroup, FormControl } from '@angular/forms';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { addressSelector } from 'app/store/reducers/address.reducer';
import { User } from 'app/models/user.model';
import { userSelector } from 'app/store/reducers/user.reducer';
import { Address } from 'app/models/address.model';
import { CartService } from 'app/services/cart/cart.service';
import { ChooseVouchersComponent } from 'app/modals/choose-vouchers/choose-vouchers.component';
import { BaseComponent } from 'app/components/base.component';
import { isLoggedSelector } from 'app/store/reducers/auth.reducer';
import { Router } from '@angular/router';
import { LoginComponent } from 'app/components/authentication/login/login.component';
import { chooseVoucherSelector } from 'app/store/reducers/voucher.reducer';
import { Voucher } from 'app/models/voucher.model';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent extends BaseComponent implements OnInit {
  public carts: Product[];
  public cartForm: FormGroup;
  public totalPriceProduct = 0;
  public totalPriceCart: number;
  public imgSize = 200;
  public user: User;
  public addressActive: Address;
  public currentPrice = 0;
  public isLogged: boolean;
  public totalPriceWithVoucher: Voucher;
  public voucherShip: boolean;
  public voucherDiscount: boolean;
  public chooseVoucher: string;
  public chooseVoucherShip: string;
  public chooseVoucherDiscount: string;
  public SHIPPING_FEE = 15000;
  // Cart LocalStorage
  public cartsLocalStorage: Product[] = [];
  public totalPriceCartLocalStorage: number;
  public totalPriceProductLocalStorage = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>,
    private cartService: CartService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    super();

    this._subscription.add(
      this.store.pipe(select(cartSelector)).subscribe(carts => {
        this.carts = carts;
        carts.forEach(element => {
          this.totalPriceProduct += element.count * element.price
        });
        this.totalPriceCart = this.totalPriceProduct + 12700;
      })
    )
    this._subscription.add(
      this.store.pipe(select(addressSelector)).subscribe(addresses => {
        this.addressActive = addresses.find(address => address.isDefault === true);
      })
    )
    this._subscription.add(
      this.store.pipe(select(isLoggedSelector)).subscribe(isLogged => {
        this.isLogged = isLogged;
      })
    );
  }

  ngOnInit() {
    // Load Cart LocalStorage
    this.cartService.loadCartLocalStorage();
    this.fetch();
    this.cartsLocalStorage.forEach(element => {
      this.totalPriceProductLocalStorage += element.count * element.price
    });
    // this._subscription.add(
    //   this.store.pipe(select(chooseVoucherSelector)).subscribe(vouchers => {
    //     this.totalPriceWithVoucher = vouchers;
    //     if (!this.chooseVoucher) {
    //       this.chooseVoucher = 'Choose vouchers / discounts';
    //     }

    //     if (vouchers.length === 0) {
    //       this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage + 15000;
    //     }

    //     if (vouchers[0] === null) {
    //       this.voucherDiscount = vouchers.find(voucher => voucher && voucher.eventTypeCode === 'DISCOUNT');
    //       this.chooseVoucherDiscount = this.voucherDiscount && this.voucherDiscount.title;
    //       this.chooseVoucher = this.chooseVoucherDiscount;
    //       if (vouchers.length !== 0) {
    //         this.totalPriceCartLocalStorage = (this.totalPriceProductLocalStorage -
    //           (this.totalPriceProductLocalStorage * (this.voucherDiscount.discountPercent / 100))) + 15000 ;
    //       }
    //     }

    //     if (vouchers[1] === null) {
    //       this.voucherShip = vouchers.find(voucher => voucher && voucher.eventTypeCode === 'FREESHIP');
    //       this.chooseVoucherShip = this.voucherShip && this.voucherShip.title;
    //       this.chooseVoucher = this.chooseVoucherShip;
    //       if (vouchers.length !== 0) {
    //         this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage +
    //               (15000 - (15000 * this.voucherShip.discountPercent / 100));
    //       }
    //     }

    //     if (vouchers[0] && vouchers[1]) {
    //       this.voucherShip = vouchers.find(voucher => voucher.eventTypeCode === 'FREESHIP');
    //       this.voucherDiscount = vouchers.find(voucher => voucher.eventTypeCode === 'DISCOUNT');
    //       this.chooseVoucherShip = this.voucherShip && this.voucherShip.title;
    //       this.chooseVoucherDiscount = this.voucherDiscount && this.voucherDiscount.title;
    //       this.chooseVoucher = this.chooseVoucherShip + ' / ' + this.chooseVoucherDiscount;
    //       if (vouchers.length !== 0) {
    //         const priceDiscount = (this.totalPriceProductLocalStorage -
    //           (this.totalPriceProductLocalStorage * (this.voucherDiscount.discountPercent / 100)));
    //         const priceShip = (15000 - (15000 * this.voucherShip.discountPercent / 100));
    //         this.totalPriceCartLocalStorage = priceDiscount + priceShip;
    //       }
    //     }
    //   })
    // )
    this._subscription.add(
      this.store.pipe(select(chooseVoucherSelector)).subscribe(vouchers => {
        this.totalPriceWithVoucher = vouchers;
        if (!this.chooseVoucher) {
          this.chooseVoucher = 'Choose vouchers / discounts';
        }

        if (!vouchers) {
          this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage + 15000;
        }

        // if (vouchers[0] === null) {
        //   this.voucherDiscount = vouchers.find(voucher => voucher && voucher.eventTypeCode === 'DISCOUNT');
        //   this.chooseVoucherDiscount = this.voucherDiscount && this.voucherDiscount.title;
        //   this.chooseVoucher = this.chooseVoucherDiscount;
        //   if (vouchers.length !== 0) {
        //     this.totalPriceCartLocalStorage = (this.totalPriceProductLocalStorage -
        //       (this.totalPriceProductLocalStorage * (this.voucherDiscount.discountPercent / 100))) + 15000 ;
        //   }
        // }

        // if (vouchers[1] === null) {
        //   this.voucherShip = vouchers.find(voucher => voucher && voucher.eventTypeCode === 'FREESHIP');
        //   this.chooseVoucherShip = this.voucherShip && this.voucherShip.title;
        //   this.chooseVoucher = this.chooseVoucherShip;
        //   if (vouchers.length !== 0) {
        //     this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage +
        //           (15000 - (15000 * this.voucherShip.discountPercent / 100));
        //   }
        // }
        if (vouchers) {
          this.voucherShip = vouchers.eventTypeCode === 'FREESHIP';
          this.voucherDiscount = vouchers.eventTypeCode === 'DISCOUNT';
          if (vouchers.eventTypeCode === 'FREESHIP') {
            this.chooseVoucherShip = vouchers.title;
            this.chooseVoucher = this.chooseVoucherShip
          }
          if (vouchers.eventTypeCode === 'DISCOUNT') {
            this.chooseVoucherDiscount = vouchers.title;
            this.chooseVoucher = this.chooseVoucherDiscount
          }
          // this.chooseVoucher = this.chooseVoucherShip + ' / ' + this.chooseVoucherDiscount;
          if (vouchers) {
            if (vouchers.eventTypeCode === 'FREESHIP') {
            const priceShip = (15000 - (15000 * vouchers.discountPercent / 100));
            this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage + priceShip;
            }
            if (vouchers.eventTypeCode === 'DISCOUNT') {
              const priceDiscount = (this.totalPriceProductLocalStorage -
                (this.totalPriceProductLocalStorage * (vouchers.discountPercent / 100)));
              this.totalPriceCartLocalStorage = priceDiscount + this.SHIPPING_FEE;
            }
          }
        }
      })
    )
    this.newPrice();
    //
    this.cartForm = new FormGroup({
      count: new FormControl(),
    });
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        this.user = user;
        if (user) {
          this.store.dispatch(new GetAddress(user.id))
        }
      })
    );
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
  }

  // cart localStorage
  public newTotalPriceProduct() {
    this._subscription.add(
      this.cartService.totalPrice$.subscribe(price => {
      })
    )
  }

  public deleteCartLocalStorage(id: number) {
    this.cartService.removeProductCartLocalStorage(id);
    this.cartService.setLength(0)
    this.fetch();
    this.openSnackBar('Delete product from cart success', 'DONE');
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  public fetch() {
    this.cartsLocalStorage = this.cartService.cartsLocalStorage;
  }

  public updateCountProductLocalStorage(product) {
    const countProduct = this.cartForm.controls['count'].value;
    if (countProduct !== product.count) {
      const newProduct: Product = {
        ...product,
        count: countProduct
      }
      const countProductNew = countProduct - product.count;
      const priceNew = countProductNew * product.price;
      this.totalPriceProductLocalStorage += priceNew;
      this.cartService.setPrice(this.totalPriceProductLocalStorage)
      this.cartService.updateCountProductLocalStorage(newProduct);
    }
  }

  public newPrice() {
    this._subscription.add(
      this.cartService.totalPrice$.subscribe(x => this.totalPriceProductLocalStorage = x)
    );
  }
  //

  public openModalChooseVoucher() {
    this.dialog.open(ChooseVouchersComponent, {
      width: '40%',
      data: this.totalPriceWithVoucher
    })
  }

  public openModalInformation() {
    this.dialog.open(InformationPaymentComponent, {
      width: '50%',
    })
  }

  public deleteProductFromCart(id) {
    this.store.dispatch(new DeleteProductFromCart(id))
  }

  public addBuyLater(product) {
    this.store.dispatch(new BuyLaterProduct(product))
  }

  public updateCountProduct(product) {
    const countProduct = this.cartForm.controls['count'].value;
    if (countProduct !== product.count) {
      const newProduct: Product = {
        ...product,
        count: countProduct
      }
      this.store.dispatch(new EditCountProductFromCart(newProduct));
    }
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSize)
  }

  public openModalLogin() {
    this.dialog.open(LoginComponent, {
      minWidth: '40%',
    })
  }

  public routePageCart() {
    if (this.isLogged) {
      this.router.navigate(['/checkout/information']);
    } else {
      this.openModalLogin();
    }
  }

}
