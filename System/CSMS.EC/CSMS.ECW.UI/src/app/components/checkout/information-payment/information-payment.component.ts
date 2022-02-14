import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { PaymentComponent } from '../payment/payment.component';
import { Store, select } from '@ngrx/store';
import { AppState, GetAddress, GetInfoFromToken, Order,
  GetLocationByAddress,
  AddressActionTypes,
  GetAddressSuccess,
  LoadBranchEnable,
  OrderActionTypes,
  OrderSuccess
} from 'app/store';
import { BaseComponent } from 'app/components/base.component';
import { addressSelector } from 'app/store/reducers/address.reducer';
import { Address } from 'app/models/address.model';
import { userSelector } from 'app/store/reducers/user.reducer';
import { User } from 'app/models/user.model';
import { Product } from 'app/models/product.model';
import { CartService } from 'app/services/cart/cart.service';
import { AppService } from 'app/configs/app-service';
import { ApiController } from 'app/api-routes/api-controller.const';
import { chooseVoucherSelector } from 'app/store/reducers/voucher.reducer';
import { Voucher } from 'app/models/voucher.model';
import { get } from 'lodash';
import { ChooseVouchersComponent } from 'app/modals/choose-vouchers/choose-vouchers.component';
import { NewAddressComponent } from 'app/modals/new-address/new-address.component';
import { Observable, observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { OrderToOrder, OrderDetail } from 'app/models/order.model';
import { locationByAddressSelector } from 'app/store/reducers/location.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Branch } from 'app/models/branch.models';
import { branchEnableSelector } from 'app/store/reducers/branch.reducer';
import { OrderService } from 'app/services/cart/order.service';
import { Document } from 'app/models/document.model';
import { SockerService } from 'app/services/socket.service';
import { OrderLoading, loadingOrderSelector } from 'app/store/reducers/order.reducer';

@Component({
  selector: 'app-information-payment',
  templateUrl: './information-payment.component.html',
  styleUrls: ['./information-payment.component.scss']
})
export class InformationPaymentComponent extends BaseComponent implements OnInit {
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['img', 'name', 'price', 'count', 'total'];
  public addresses: Address[];
  public addressActive: Address;
  public user: User;
  public cartsLocalStorage: Product[] = [];
  public imgSize = 70;
  public chooseVoucher: Voucher;
  public isChosen$: Observable<Voucher[]>;
  public voucherShip: boolean;
  public voucherDiscount: boolean;
  public totalPriceProductLocalStorage = 0;
  public totalPriceCartLocalStorage: number;
  public priceShipping = 15000;
  public SHIPPING_FEE = 15000;
  public SHIPPING_SERVICE = 'Panda Express';
  public orderForm: FormGroup;
  public branchs: Branch[];
  public distance = Number.MAX_SAFE_INTEGER;
  public storeNearest: Branch;
  public priceDiscount = 0;
  public discountVoucher = 0;
  public document: Document;
  public testSocketForm: FormGroup;
  public loadingOrder$: Observable<OrderLoading>

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<InformationPaymentComponent>,
    private store: Store<AppState>,
    private cartService: CartService,
    private dispatcher: Actions,
    private socketService: SockerService
  ) {
    super();
    this._subscription.add(
      this.store.pipe(select(addressSelector)).subscribe(addresses => {
        this.addressActive = addresses.find(address => address.isDefault === true);
      })
    )
    this.store.pipe(select(chooseVoucherSelector)).subscribe(vouchers => {
      this.chooseVoucher = vouchers;
    })
    this.store.dispatch(new LoadBranchEnable());
    this.store.pipe(select(branchEnableSelector)).subscribe(branchs => {
      this.branchs = branchs;
    })
  }

  ngOnInit() {
    this.loadingOrder$ = this.store.pipe(select(loadingOrderSelector));
    this.testSocketForm = new FormGroup({
      doc: new FormControl(''),
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
    this.cartService.loadCartLocalStorage();
    this.fetch();
    this.cartsLocalStorage.forEach(element => {
      this.totalPriceProductLocalStorage += element.count * element.price
    });

    this._subscription.add(
      this.store.pipe(select(chooseVoucherSelector)).subscribe(vouchers => {

        if (!vouchers) {
          if (this.totalPriceProductLocalStorage >= 300000) {
            this.priceShipping = 0;
          }
          this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage + this.priceShipping;
        }

        if (vouchers) {
          this.voucherShip = vouchers.eventTypeCode === 'FREESHIP';
          this.voucherDiscount = vouchers.eventTypeCode === 'DISCOUNT';
          if (this.voucherShip) {
            const priceShip = (this.priceShipping - (this.priceShipping * vouchers.discountPercent / 100));
            if (this.totalPriceProductLocalStorage >= 300000) {
              this.priceShipping = 0;
            } else {
              this.priceShipping = priceShip;
            }
            this.totalPriceCartLocalStorage = this.totalPriceProductLocalStorage + this.priceShipping;
          }
          if (this.voucherDiscount) {
            this.priceDiscount = (this.totalPriceProductLocalStorage -
              (this.totalPriceProductLocalStorage * (vouchers.discountPercent / 100)));
            this.discountVoucher = (this.totalPriceProductLocalStorage * (vouchers.discountPercent / 100));
            this.totalPriceProductLocalStorage = this.priceDiscount;
            if (this.totalPriceProductLocalStorage >= 300000) {
              this.priceShipping = 0;
            }
            this.totalPriceCartLocalStorage = this.priceDiscount + this.priceShipping;
          }
          // if (this.totalPriceCartLocalStorage >= 300000) {
          //   this.priceShipping = 0;
          // } else {
          //   this.priceShipping = priceShip;
          // }
          // this.totalPriceCartLocalStorage = this.priceDiscount + priceShip;
          // if (vouchers.length !== 0) {
          // }
        }
      })
    )
    this._subscription.add(
      this.dispatcher.pipe(
        ofType(
          AddressActionTypes.GetAddressSuccessAction
        ),
        filter(
          (action: GetAddressSuccess) =>
            (action instanceof GetAddressSuccess)
        ),
      ).subscribe(action => {
        this.findStore();
      })
    );
  }

  public order() {
    const orderToOrder: OrderToOrder = {
      userId: this.user.id,
      fullname: this.user.firstName + ' ' + this.user.middleName + ' ' + this.user.lastName,
      receiver: this.addressActive.receiver,
      phoneNumber: this.addressActive.phoneNumber,
      address: this.addressActive.detail + ',' + this.addressActive.ward +
        ',' + this.addressActive.district + ',' + this.addressActive.province + ',' + this.addressActive.country,
      merchandiseSubtotal: this.totalPriceProductLocalStorage + this.discountVoucher,
      shippingFee: this.SHIPPING_FEE,
      shippingService: this.SHIPPING_SERVICE,
      storeId: this.storeNearest && this.storeNearest.id,
      storeCode: this.storeNearest && this.storeNearest.shortName,
      storeName: this.storeNearest && this.storeNearest.name,
      distance: this.distance.toFixed(1),
      shippingNote: '',
      voucherId: this.chooseVoucher && this.chooseVoucher.id,
      voucherCode: null,
      discountPercent: this.chooseVoucher && this.chooseVoucher.discountPercent,
      usedCoins: '0',
      discountShippingFee: '0',
      discountVoucherApplied: this.chooseVoucher && this.chooseVoucher.eventTypeCode === 'FREESHIP' ?
                              this.SHIPPING_FEE : this.priceDiscount,
      isFreeShipVoucher: this.chooseVoucher && this.chooseVoucher.eventTypeCode === 'FREESHIP',
      total: this.totalPriceCartLocalStorage,
      earnedCoins: '0',
      orderDetails: this.cartsLocalStorage.map(product => ({
        productId: product.id,
        productName: product.name,
        categoryId: product.categoryId,
        categoryName: product.categoryName,
        quantity: product.count,
        price: product.price,
        originalPrice: null,
        photoId: product.avatarId,
    })),
    }

    this.store.dispatch(new Order(orderToOrder));
    this._subscription.add(
      this.dispatcher.pipe(
        ofType(
          OrderActionTypes.OrderSuccessAction
        ),
        filter(
          (action: OrderSuccess) =>
            (action instanceof OrderSuccess)
        ),
      ).subscribe(action => {
        this.socketIO(orderToOrder.storeId);
      })
    );
  }

  public socketIO(storeid: number) {
    const newDoc: Document = {
      id: 'order',
      doc: 'There are new order',
      type: 'New Order',
      storeID: storeid,
    }
    this.socketService.orderSocket(newDoc);
  }

  public findStore() {
    let address
    if (this.addressActive && this.addressActive.detail) {
      address = this.addressActive.detail + ',' + this.addressActive && this.addressActive.ward +
       ',' + this.addressActive && this.addressActive.district + ',' + this.addressActive && this.addressActive.province
    } else {
      address = this.addressActive && this.addressActive.ward + ',' + this.addressActive && this.addressActive.district +
       ',' + this.addressActive && this.addressActive.province
    }
    this.store.dispatch(new GetLocationByAddress(address));
    this.store.pipe(select(locationByAddressSelector)).subscribe(location => {
      if (location) {
        if (location.status.code === 200) {
          const latAdd = location.results[0].geometry.lat;
          const lonAdd = location.results[0].geometry.lng;
          this.branchs.forEach(element => {
            const distance = this.getDistanceFromLatLonInKm(element.latitude, element.longitude, latAdd, lonAdd);
            if (this.distance >= distance) {
              this.storeNearest = element;
              this.distance = distance;
            }
          });
        }
      }
    })
  }

  public getDistanceFromLatLonInKm (lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
    return d;
}

  public deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  public get isChosen(): boolean {
    return !!get(this, 'chooseVoucher');
  }

  public fetch() {
    this.cartsLocalStorage = this.cartService.cartsLocalStorage;
  }

  public openModalPayment() {
    this.dialog.open(PaymentComponent, {
      width: '50%',
    });
    this.close();
  }

  public openModalChooseVoucher() {
    this.dialog.open(ChooseVouchersComponent, {
      width: '40%',
      data: this.chooseVoucher,
    })
  }

  public openModalAddress() {
    this.dialog.open(NewAddressComponent, {
      width: '40%',
      data: this.addressActive
    })
  }

  public close() {
    this.dialogRef.close();
  }

  public getImg(id) {
    return AppService.getPath(ApiController.CdnApi.ProductPhoto + id + '/' + this.imgSize)
  }
}
