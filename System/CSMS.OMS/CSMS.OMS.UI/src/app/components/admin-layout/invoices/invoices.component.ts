import { Component, OnInit } from '@angular/core';
import { CsmsOrder } from '../../../models/order/order.model';
import { DateFormat } from '../../../commons/consts/date-format.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../commons/dropdown/dropdown.component';
import { Message } from '../../../commons/consts/message.const';
import { MomentHelper } from '../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../services/notification.service';
import { OrderService } from '../../../services/order/order.service';
import { OrderStatus } from '../../../commons/enums/order-status.enum';
import { PagedListModel } from '../../../models/app/paged-list.model';
import { PaginationComponent } from '../../commons/pagination/pagination.component';
import { InvoiceExportPopupComponent } from './invoice-export-popup/invoice-export-popup.component';
import { InvoiceDetailPopupComponent } from './invoice-detail-popup/invoice-detail-popup.component';

export const IdTabs = {
  Overview: 1,
  SearchFilter: 2,
  Reports: 3
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {

  public loading = false;
  public page = 1;
  public pageSize: number = PaginationComponent.getDefaultPageSize();
  public isAppearedCheckAll = false;
  public listStatus: DropDownData[] = [];
  public listInvoice: PagedListModel<CsmsOrder>;
  public listInvoiceIdSelected: string[] = [];

  // Filters
  private voucherId: number = null;
  private storeIds: number[] = [];
  public searchString = '';
  public statusSelected = OrderStatus.Completed.toString();
  public startDate = MomentHelper.startDateOfMonth().format(DateFormat.DateFormatJson);
  public endDate = MomentHelper.endDateOfMonth().format(DateFormat.DateFormatJson);

  constructor(
    private dialogService: DialogService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.initFilter();
    this.getListInvoice(1, this.pageSize);
  }

  private initFilter() {
    this.listStatus.push(
      new DropDownData('All', 'All'),
      new DropDownData(OrderStatus.Pending.toString(), 'Pending Confirm'),
      new DropDownData(OrderStatus.Cooking.toString(), 'Cooking'),
      new DropDownData(OrderStatus.Shipping.toString(), 'Shipping'),
      new DropDownData(OrderStatus.Completed.toString(), 'Completed'),
      new DropDownData(OrderStatus.Canceled.toString(), 'Canceled'));
  }

  public getListInvoice(page: number = 1, pageSize: number = PaginationComponent.getDefaultPageSize()): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;
    this.orderService.getListOrder(
      this.page,
      this.pageSize,
      this.statusSelected,
      this.voucherId,
      this.startDate ? MomentHelper.parseDateToString(this.startDate, null, DateFormat.DateFormatMMDDYYYY) : null,
      this.endDate ? MomentHelper.parseDateToString(this.endDate, null, DateFormat.DateFormatMMDDYYYY) : null,
      this.searchString,
      this.storeIds.join(',')
    ).subscribe((res) => {
      this.listInvoice = res;
      this.handleAppearingCheckAll();
      this.loading = false;
    });
  }

  private handleAppearingCheckAll(): void {
    if (this.listInvoice && this.listInvoice.items) {
      this.listInvoice.items.forEach((item) => {
        if (this.listInvoiceIdSelected.some((x) => x === item.id)) {
          item.selected = true;
        }
      });
      if (this.listInvoice.items.every((item) => this.listInvoiceIdSelected.some((x) => x === item.id))) {
        this.isAppearedCheckAll = true;
      } else {
        this.isAppearedCheckAll = false;
      }
    }
  }

  public onClickCheckedAllItem(event): void {
    if (event) {
      this.listInvoice.items.forEach((item) => {
        item.selected = true;
        if (!this.listInvoiceIdSelected.some(x => x === item.id)) {
          this.listInvoiceIdSelected.push(item.id);
        }
      });
    } else {
      this.listInvoice.items.forEach((item) => {
        item.selected = false;
        this.listInvoiceIdSelected = this.listInvoiceIdSelected.filter((x) => x !== item.id);
      });
    }
    this.isAppearedCheckAll = event;
  }

  public onClickCheckedItem(event, index): void {
    if (event) {
      this.listInvoiceIdSelected.push(this.listInvoice.items[index].id);
    } else {
      this.listInvoiceIdSelected = this.listInvoiceIdSelected
        .filter((item) => item !== this.listInvoice.items[index].id);
    }
    this.listInvoice.items[index].selected = event;
    this.handleAppearingCheckAll();
  }

  public parseDateTimeToString(date: string): string {
    return MomentHelper.formatDate(date, DateFormat.DateTimeFormatDDMMYYYYHHmm);
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public getOrderStatus(order: CsmsOrder): string {
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
      return 'Shipping';
    }

    if (order.completedTime != null) {
      return 'Completed';
    }

    return 'N/A';
  }

  public getTotalDishes(order: CsmsOrder): number {
    let total = 0;
    order.orderDetails.forEach(item => {
      total += item.quantity;
    });

    return total;
  }

  public onViewOrderDetail(order: CsmsOrder): void {
    this.dialogService.addDialog(InvoiceDetailPopupComponent, {
      order: order
    }).subscribe();
  }

  public onExport(): void {
    const searchCondition: any[] = [];
    searchCondition.push(this.statusSelected);
    searchCondition.push(this.voucherId);
    searchCondition.push(this.startDate ? MomentHelper.parseDateToString(this.startDate, null, DateFormat.DateFormatMMDDYYYY) : null);
    searchCondition.push(this.endDate ? MomentHelper.parseDateToString(this.endDate, null, DateFormat.DateFormatMMDDYYYY) : null);
    searchCondition.push(this.searchString);
    searchCondition.push(this.storeIds.join(','));
    this.dialogService.addDialog(InvoiceExportPopupComponent, {
      selectedInvoiceIds: this.listInvoiceIdSelected,
      searchCondition
    }).subscribe();
  }
}
