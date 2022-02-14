import { Component, OnInit } from '@angular/core';
import { OrderStatus } from '../../../commons/enums/order-status.enum';
import { OrderService } from '../../../services/order/order.service';
import { CsmsOrder, TodayOrderViewModel } from '../../../models/order';
import { MomentHelper } from '../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../commons/consts/date-format.const';
import { CsmsOrderDetail } from '../../../models/order/order.model';
import { NotificationService } from '../../../services/notification.service';
import { Message } from '../../../commons/consts/message.const';
import { SockerService } from 'app/services/socket.service';
import { Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'app/models/document.model';
import { BaseComponent } from 'app/components/base.component';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../ngrx-store/reducers';
import { UserService } from 'app/services/user/user.service';
import { UserViewModel } from 'app/models/admin-space/user.model';
import { RouterService } from 'app/services/router.service';
import { CsmsBranch, EnabledBranchViewModel } from '../../../models/system-data/branch.model';
import { BranchService } from '../../../services/system/branch.service';
import { DropDownData } from '../../commons/dropdown/dropdown.component';
import { RoleIdConstant, RoleConstant } from '../../../commons/consts/permission.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { NewOrderComponent } from './new-order/new-order.component';
import { EnableProductViewModel } from '../../../models/product/product-list';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent extends BaseComponent implements OnInit {

  public loading = false;
  public RoleConstant = RoleConstant;
  public orderSelected: CsmsOrder;
  public OrderStatus = OrderStatus;
  public orderStatusSelected: number = OrderStatus.Pending;
  public overviewData: TodayOrderViewModel;
  public _docSub: Subscription;
  public document: Document;
  public userId: number;
  public user: UserViewModel;
  public products: EnableProductViewModel[] = [];
  public listBranch: DropDownData[] = [];
  public tables: string[] = [];
  public branchIdSelected: number;
  public branch: EnabledBranchViewModel[] = [];

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private socketService: SockerService,
    private store: Store<fromRoot.State>,
    private branchService: BranchService,
    private userService: UserService,
    private routerService: RouterService,
    private dialogService: DialogService,
    private productService: ProductService) {
    super();
  }

  ngOnInit() {
    this.store.select(fromRoot.getCurrentUser).subscribe((res) => {
      if (res) {
        this.userId = res.id;
        this.initData();
      }
    });
    this.loading = true;
    const id = 'order'
    this.socketService.getOrder(id);
    this._subscription.add(
      this._docSub = this.socketService.currentDocument.pipe().subscribe(document => {
        if (document && this.user && this.branchIdSelected === document.storeID) {
          this.onGetOrders(this.orderStatusSelected, false);
        }
        this.document = document;
      })
    );
  }

  private initData() {
    zip(
      this.userService.getUserInfo(this.userId),
      this.branchService.getEnabledBranch(),
      this.productService.getEnableProduct()
    ).pipe(
      map(([user, branchResponse, products]) => {

        if (user) {
          this.user = user;
        } else {
          this.routerService.notFound();
        }

        if (products) {
          this.products = products;
        }

        if (branchResponse) {
          this.branch = branchResponse;
          if (this.user.roleId === RoleIdConstant.Admin) {
            this.branch.forEach((item) => {
              this.listBranch.push(new DropDownData(item.id, item.shortName + ' - ' + item.name));
            });
            this.branchIdSelected = this.listBranch[0] ? +this.listBranch[0].key : 0;
          } else {
            this.branchIdSelected = this.user.branchId;
          }
          console.log(this.branchIdSelected);

          const branchSelected = this.branch.find(item => item.id === this.branchIdSelected);
          this.tables = branchSelected.tables ? branchSelected.tables.split(', ') : [];
          this.onGetOrders();
        }
      })
    ).subscribe();
  }

  public onGetOrders(orderStatus: number = OrderStatus.Pending, loading = true): void {
    this.loading = loading;
    let branchIds = '';
    if (this.user.roleId === RoleIdConstant.Admin) {
      branchIds = this.branchIdSelected.toString();
    } else {
      branchIds = this.user.branchId.toString();
    }

    this.orderService.getTodayOrder(orderStatus, branchIds).subscribe(
      (res) => {
        if (res) {
          this.loading = false;
          this.orderStatusSelected = orderStatus ? orderStatus : this.orderStatusSelected;
          this.overviewData = res;
          this.orderSelected = null;
        }
      }
    )
  }

  public onConfirmNewOrder(orderId: string): void {
    this.orderService.updateStatusOrder(orderId, OrderStatus.Cooking).subscribe(
      (res) => {
        if (res) {
          if (orderId[0] !== 'T') {
            this.overviewData.items = this.overviewData.items.filter(item => item.id !== orderId);
            this.overviewData.totalCooking++;
            this.overviewData.totalPending--;
          } else {
            const index = this.overviewData.items.findIndex(item => item.id === orderId);
            this.overviewData.items[index] = res;
          }

          this.socketService.updateOrder({
            id: 'order',
            doc: 'There are confirmed order',
            type: 'Update Order',
            storeID: this.branchIdSelected,
            orderId: this.orderSelected.id,
            orderUserId: this.orderSelected.userId
          });
          this.orderSelected = null;
          this.notificationService.success(Message.Order.CONFIRM_SUCCESS);
        }
      }
    );
  }

  public onCancelOrder(orderId: string): void {
    this.orderService.updateStatusOrder(orderId, OrderStatus.Canceled).subscribe(
      (res) => {
        if (res) {
          if (orderId[0] !== 'T') {
            this.overviewData.items = this.overviewData.items.filter(item => item.id !== orderId);
            this.overviewData.totalPending--;
          } else {
            const index = this.overviewData.items.findIndex(item => item.id === orderId);
            this.overviewData.items[index] = res;
          }

          this.socketService.updateOrder({
            id: 'order',
            doc: 'There are canceled order',
            type: 'Update Order',
            storeID: this.branchIdSelected,
            orderId: this.orderSelected.id,
            orderUserId: this.orderSelected.userId
          });

          this.overviewData.totalCanceled++;
          this.orderSelected = null;
          this.notificationService.success(Message.Order.CANCEL_SUCCESS);
        }
      }
    )
  }

  public onShipping(orderId: string): void {
    this.orderService.updateStatusOrder(orderId, OrderStatus.Shipping).subscribe(
      (res) => {
        if (res) {
          if (orderId[0] !== 'T') {
            this.overviewData.items = this.overviewData.items.filter(item => item.id !== orderId);
            this.overviewData.totalShipping++;
            this.overviewData.totalCooking--;
          } else {
            const index = this.overviewData.items.findIndex(item => item.id === orderId);
            this.overviewData.items[index] = res;
          }

          this.socketService.updateOrder({
            id: 'order',
            doc: 'There are shipping order',
            type: 'Update Order',
            storeID: this.branchIdSelected,
            orderId: this.orderSelected.id,
            orderUserId: this.orderSelected.userId
          });

          this.orderSelected = null;
          this.notificationService.success(Message.Order.SHIPPING_SUCCESS);
        }
      }
    )
  }

  public onCompleted(orderId: string): void {
    this.orderService.updateStatusOrder(orderId, OrderStatus.Completed).subscribe(
      (res) => {
        if (res) {
          if (orderId[0] !== 'T') {
            this.overviewData.items = this.overviewData.items.filter(item => item.id !== orderId);
            this.overviewData.totalShipping--;
          } else {
            const index = this.overviewData.items.findIndex(item => item.id === orderId);
            this.overviewData.items[index] = res;
          }

          this.socketService.updateOrder({
            id: 'order',
            doc: 'There are completed order',
            type: 'Update Order',
            storeID: this.branchIdSelected,
            orderId: this.orderSelected.id,
            orderUserId: this.orderSelected.userId
          });

          this.overviewData.totalCompleted++;
          this.orderSelected = null;
          this.notificationService.success(Message.Order.COMPLETE_SUCCESS);
        }
      }
    )
  }

  public onSelectBranch(branchId: number): void {
    this.branchIdSelected = branchId;
    const branchSelected = this.branch.find(item => item.id === this.branchIdSelected);
    this.tables = branchSelected.tables ? branchSelected.tables.split(', ') : [];
    this.onGetOrders();
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public getTimeOnly(datetime: Date): string {
    return MomentHelper.formatDate(datetime, DateFormat.TimeFormat);
  }

  public getNumOfDishs(details: CsmsOrderDetail[]): number {
    let result = 0;
    details.forEach(item => {
      result += item.quantity;
    });

    return result;
  }

  public getOrderStatusId(order: CsmsOrder): OrderStatus {
    if (order.canceledTime != null) {
      return OrderStatus.Canceled;
    }

    if (order.cookedTime == null) {
      return OrderStatus.Pending;
    }

    if (order.shippedTime == null) {
      return OrderStatus.Cooking;
    }

    if (order.completedTime == null) {
      return OrderStatus.Shipping;
    }

    if (order.completedTime != null) {
      return OrderStatus.Completed;
    }

    return null;
  }

  public getOrderStatusText(order: CsmsOrder): string {

    if (!order) {
      return '';
    }

    if (order.canceledTime != null) {
      return 'Canceled';
    }

    if (order.cookedTime == null) {
      return 'Pending';
    }

    if (order.shippedTime == null) {
      return 'Cooking';
    }

    if (order.completedTime == null) {
      if (order.id[0] === 'T') {
        return 'Eating';
      }

      return 'Shipping';
    }

    if (order.completedTime != null) {
      return 'Completed';
    }

    return 'N/A';
  }

  public isShowTables(): boolean {
    if (this.orderStatusSelected !== OrderStatus.Completed && this.orderStatusSelected !== OrderStatus.Canceled) {
      return true;
    }

    return false;
  }

  public onAddNewOrder(table: string) {
    this.dialogService.addDialog(NewOrderComponent, {
      order: this.newOrder(table),
      products: this.products
    }).subscribe(
      (res) => {
        if (res && res.id !== 0) {
          this.overviewData.items.push(res);
          this.socketService.addNewOrder({
            id: 'order',
            doc: 'There are new order',
            type: 'New Order',
            storeID: this.branchIdSelected,
            orderId: res.id,
            orderUserId: this.user.id
          });
        }
      }
    );
  }

  private newOrder(table: string): CsmsOrder {
    const branchSelected = this.branch.find(item => item.id === this.branchIdSelected);

    const order = new CsmsOrder();
    const now = new Date();
    order.id = 'T' + table + '-' + MomentHelper.formatDate(now, 'YYMMDDHHmmss');
    console.log(order.id);
    order.userId = -1;
    order.fullname = branchSelected.name;
    order.receiver = branchSelected.name;
    order.phoneNumber = '0979 31 9598';
    order.address = branchSelected.address;
    order.shippingFee = 0;
    order.shippingService = 'AT STORE';
    order.storeId = this.branchIdSelected;
    order.storeCode = branchSelected.shortName;
    order.storeName = branchSelected.name;
    order.distance = 0;
    order.usedCoins = 0;
    order.earnedCoins = 0;
    order.orderDetails = [];

    return order;
  }

  public isShowOrder(order: CsmsOrder): boolean {
    if (!this.isShowTables()) {
      return true;
    } else if (order.id[0] !== 'T') {
      return true;
    }

    return false;
  }

  public getOrderByTable(table: string): CsmsOrder {
    const result = this.overviewData ?
      this.overviewData.items.find(item => item.id.slice(0, table.length + 1) === 'T' + table) : undefined;

    if (result &&
      this.getOrderStatusId(result) !== OrderStatus.Canceled &&
      this.getOrderStatusId(result) !== OrderStatus.Completed) {
      return result;
    }

    return undefined;
  }

  public getStatusColor(order: CsmsOrder): string {
    if (order.cookedTime == null) {
      return 'bg-info';
    }

    if (order.shippedTime == null) {
      return 'bg-warning';
    }

    if (order.completedTime == null) {
      return 'bg-danger';
    }
  }
}
