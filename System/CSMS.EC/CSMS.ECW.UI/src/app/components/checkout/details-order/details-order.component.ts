import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { PaymentComponent } from '../payment/payment.component';
import { Store, select } from '@ngrx/store';
import { AppState, GetAddress, GetInfoFromToken, Order,
  GetLocationByAddress,
  AddressActionTypes,
  GetAddressSuccess,
  LoadBranchEnable,
  GetOrderByUserId,
  GetOrderById,
  CancelOrder,
  OrderActionTypes,
  CancelOrderSuccess
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
import { Observable, observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { OrderToOrder, OrderDetail, OrderCart } from 'app/models/order.model';
import { locationByAddressSelector } from 'app/store/reducers/location.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { filter } from 'rxjs/operators';
import { Branch } from 'app/models/branch.models';
import { branchEnableSelector } from 'app/store/reducers/branch.reducer';
import { getorderByUserIdSelector, getOrderByIdSelector, OrderLoading, loadingOrderSelector } from 'app/store/reducers/order.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { SockerService } from 'app/services/socket.service';
import { Document } from 'app/models/document.model';
@Component({
  selector: 'app-details-order',
  templateUrl: './details-order.component.html',
  styleUrls: ['./details-order.component.scss']
})
export class DetailsOrderComponent extends BaseComponent implements OnInit {

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
  public totalPriceCartLocalStorage: string;
  public priceShipping = 15000;
  public SHIPPING_FEE = 15000;
  public SHIPPING_SERVICE = 'Panda Express';
  public orderForm: FormGroup;
  public branchs: Branch[];
  public distance = Number.MAX_SAFE_INTEGER;
  public storeNearest: Branch;
  public priceDiscount = 0;
  public discountVoucher = 0;
  public orderId: string;
  public productDetail: any;
  public orderDetail: OrderCart;
  public timeOrder: String;
  public loadingOrder$: Observable<OrderLoading>;
  public _docSub: Subscription;
  public document: Document;
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DetailsOrderComponent>,
    private store: Store<AppState>,
    private cartService: CartService,
    private dispatcher: Actions,
    private route: ActivatedRoute,
    private socketService: SockerService,
    private router: Router,
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
    this.store.dispatch(new GetInfoFromToken(localStorage.getItem('token')));
    this._subscription.add(
      this.store.pipe(select(userSelector)).subscribe(user => {
        this.user = user;
        if (user) {
          this.store.dispatch(new GetAddress(user.id))
          // this.store.dispatch(new GetOrderByUserId(user.id))
        }
      })
    );
    const id = 'order';
    this.socketService.getOrder(id);
    this._subscription.add(
      this._docSub = this.socketService.currentDocument.pipe().subscribe(document => {
        if (document && this.user && this.user.id === document.orderUserId) {
          this.store.dispatch(new GetOrderById(document.orderId));
          this.getOrderById();
        }
        this.document = document;
      })
    );
    this.loadingOrder$ = this.store.pipe(select(loadingOrderSelector));
    this.route.paramMap.subscribe(param => {
      this.orderId = param.get('id');
      this.store.dispatch(new GetOrderById(this.orderId));
    })
    this.getOrderById();
    this.cartService.loadCartLocalStorage();
    this.fetch();
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

  public getOrderById() {
    this.store.pipe(select(getOrderByIdSelector)).subscribe(order => {
      if (order) {
        this.orderDetail = order;
        this.productDetail = order.orderDetails;
        this.productDetail.forEach(element => {
          this.totalPriceProductLocalStorage += element.quantity * element.price;
          this.totalPriceCartLocalStorage = order.total;
        });
        if (order.isFreeShipVoucher === true) {
          this.priceShipping = 0;
        }
        this.timeOrder = moment(order.orderedTime).format('MMMM Do YYYY, h:mm:ss a');
      }
    })
  }

  public statusOrderPending() {
    if (this.orderDetail && this.orderDetail.orderedTime && !this.orderDetail.cookedTime &&
      !this.orderDetail.shippedTime && !this.orderDetail.completedTime && !this.orderDetail.canceledTime) {
      return true;
    } else {
      return false;
    }
  }

  public statusOrderCooking() {
    if (this.orderDetail && this.orderDetail.orderedTime && this.orderDetail.cookedTime &&
      !this.orderDetail.shippedTime && !this.orderDetail.completedTime && !this.orderDetail.canceledTime) {
      return true;
    } else {
      return false;
    }
  }

  public statusOrderShipping() {
    if (this.orderDetail && this.orderDetail.orderedTime && this.orderDetail.cookedTime &&
      this.orderDetail.shippedTime && !this.orderDetail.completedTime && !this.orderDetail.canceledTime) {
      return true;
    } else {
      return false;
    }
  }

  public statusOrderCompleted() {
    if (this.orderDetail && this.orderDetail.orderedTime && this.orderDetail.cookedTime &&
      this.orderDetail.shippedTime && this.orderDetail.completedTime && !this.orderDetail.canceledTime) {
      return true;
    } else {
      return false;
    }
  }

  public statusOrderCanceled() {
    if (this.orderDetail && this.orderDetail.orderedTime && !this.orderDetail.cookedTime &&
      !this.orderDetail.shippedTime && !this.orderDetail.completedTime && this.orderDetail.canceledTime) {
      return true;
    } else {
      return false;
    }
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

  public socketIO() {
    const newDoc: Document = {
      id: 'order',
      doc: 'There are canceled order',
      type: 'Cancel Order',
      storeID: this.orderDetail.storeId,
    }
    this.socketService.orderSocket(newDoc);
  }

  public cancelOrder() {
    this.store.dispatch(new CancelOrder(this.orderId));
    this._subscription.add(
      this.dispatcher.pipe(
        ofType(
          OrderActionTypes.CancelOrderSuccessAction
        ),
        filter(
          (action: CancelOrderSuccess) =>
            (action instanceof CancelOrderSuccess)
        ),
      ).subscribe(action => {
        this.router.navigate(['/']);
        this.socketIO();
      })
    );
  }

}
