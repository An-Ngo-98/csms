import { AddUserPopupComponent } from '../add-user-popup/add-user-popup.component';
import { ApiController } from '../../../../commons/consts/api-controller.const';
import { AppService } from '../../../../configs/app-service';
import { Component, OnInit } from '@angular/core';
import { CustomerList } from '../../../../models/customer/customer-list';
import { CustomerService } from '../../../../services/user/customer.service';
import { CustomerStatus } from '../../../../commons/consts/customer.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { Message } from '../../../../commons/consts/message.const';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../../services/notification.service';
import { PagedListModel } from '../../../../models/app/paged-list.model';
import { PaginationComponent } from '../../../commons/pagination/pagination.component';
import { RouterService } from '../../../../services/router.service';
import { SortType } from '../../../../commons/enums/sort.enum';
import { UserExportPopupComponent } from '../user-export-popup/user-export-popup.component';
import { UserService } from '../../../../services/user/user.service';
import { UserType } from '../../../../commons/enums/user.enum';
import { UserViewModel } from '../../../../models/admin-space/user.model';

enum ColumnName {
  CustomerName = 1,
  Birthday = 2,
  Username = 3,
  Email = 4,
  PhoneNumber = 5,
  Gender = 6,
  Address = 7,
  Status = 8
}

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html'
})
export class CustomerManagementComponent implements OnInit {

  public loading = false;
  public Message = Message;
  public avatarSize = 50;
  public avatarUrl = AppService.getPath(ApiController.CdnApi.UserAvatar + '{0}/' + this.avatarSize);

  public page = 1;
  public pageSize: number = PaginationComponent.getDefaultPageSize();
  public isAppearedCheckAll = false;
  public sortField: number = ColumnName.CustomerName;
  public sortType: number = SortType.ASC;
  public listStatus: DropDownData[] = [];
  public listCustomer: PagedListModel<CustomerList>;
  public listCustomerIdSelected: number[] = [];

  // Filters
  public searchFor = '';
  public statusSelected = CustomerStatus.All;

  constructor(
    private customerService: CustomerService,
    private userService: UserService,
    private routerService: RouterService,
    private dialogService: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.initFilter();
    this.getListCustomer(1, this.pageSize);
  }

  private initFilter() {
    this.listStatus.push(
      new DropDownData(CustomerStatus.All.toString(), 'All'),
      new DropDownData(CustomerStatus.Working.toString(), 'Working'),
      new DropDownData(CustomerStatus.Blocked.toString(), 'Blocked'));
  }

  public getListCustomer(page: number = 1, pageSize: number = PaginationComponent.getDefaultPageSize()): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;
    this.customerService.getListCustomer(
      this.page,
      this.pageSize,
      this.sortField,
      this.sortType,
      this.statusSelected,
      this.searchFor
    ).subscribe(
      (res) => {
        this.listCustomer = res;
        this.handleAppearingCheckAll();
        this.loading = false;
      },
      (err) => {
        this.notificationService.error(Message.CustomerManagement.LOAD_CUSTOMER_LIST_FAIL);
        this.loading = false;
      });
  }

  private handleAppearingCheckAll(): void {
    if (this.listCustomer && this.listCustomer.items) {
      this.listCustomer.items.forEach((item) => {
        if (this.listCustomerIdSelected.some((x) => x === item.customerId)) {
          item.selected = true;
        }
      });
      if (this.listCustomer.items.every((item) => this.listCustomerIdSelected.some((x) => x === item.customerId))) {
        this.isAppearedCheckAll = true;
      } else {
        this.isAppearedCheckAll = false;
      }
    }
  }

  public sortData(sortField: number, sortType: number): void {
    this.sortField = sortField;
    this.sortType = sortType;
    this.getListCustomer(this.page, this.pageSize);
  }

  public deleteCustomer(customerId: number): void {
    this.loading = true;
    this.userService.deleteUser(customerId).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.listCustomer.items = this.listCustomer.items.filter((item) => item.customerId !== customerId);
        this.notificationService.success(Message.CustomerManagement.DELETE_CUSTOMER_SUCCESS);
      }
    }, (err) => {
      this.loading = false;
      this.notificationService.error(Message.CustomerManagement.DELETE_CUSTOMER_FAIL);
    });
  }

  public onClickCheckedAllItem(event): void {
    if (event) {
      this.listCustomer.items.forEach((item) => {
        item.selected = true;
        if (!this.listCustomerIdSelected.some(x => x === item.customerId)) {
          this.listCustomerIdSelected.push(item.customerId);
        }
      });
    } else {
      this.listCustomer.items.forEach((item) => {
        item.selected = false;
        this.listCustomerIdSelected = this.listCustomerIdSelected.filter((x) => x !== item.customerId);
      });
    }
    this.isAppearedCheckAll = event;
  }

  public onClickCheckedItem(event, index): void {
    if (event) {
      this.listCustomerIdSelected.push(this.listCustomer.items[index].customerId);
    } else {
      this.listCustomerIdSelected = this.listCustomerIdSelected
        .filter((item) => item !== this.listCustomer.items[index].customerId);
    }
    this.listCustomer.items[index].selected = event;
    this.handleAppearingCheckAll();
  }

  public onExport(): void {
    const searchCondition: any[] = [];
    searchCondition.push(this.sortField);
    searchCondition.push(this.sortType);
    searchCondition.push(this.statusSelected);
    searchCondition.push(this.searchFor);
    this.dialogService.addDialog(UserExportPopupComponent, {
      userType: UserType.Customer,
      selectedUserIds: this.listCustomerIdSelected,
      searchCondition
    }).subscribe();
  }

  public parseDateToString(date: string): string {
    return MomentHelper.parseDateToString(date);
  }

  public onClickViewUserProfile(id: number): void {
    this.routerService.userInfo(id);
  }

  public onClickAddCustomer() {
    this.dialogService.addDialog(AddUserPopupComponent).subscribe((res: UserViewModel) => {
      if (res) {
        this.getListCustomer();
        this.notificationService.success(Message.CustomerManagement.ADD_NEW_CUSTOMER_SUCCESS);
      }
    });
  }
}
