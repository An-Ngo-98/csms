import { AddUserPopupComponent } from '../add-user-popup/add-user-popup.component';
import { ApiController } from 'app/commons/consts/api-controller.const';
import { AppService } from 'app/configs/app-service';
import { BranchService } from '../../../../services/system/branch.service';
import { Component, OnInit, Input } from '@angular/core';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { EmployeeList } from 'app/models/employee';
import { EmployeeService } from '../../../../services/user/employee.service';
import { EmployeeStatus } from '../../../../commons/consts/employee.const';
import { EmployeeStatusCode } from 'app/commons/enums/employee.enum';
import { map } from 'rxjs/operators';
import { Message } from '../../../../commons/consts/message.const';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../../services/notification.service';
import { PagedListModel } from 'app/models/app';
import { PaginationComponent } from '../../../commons/pagination/pagination.component';
import { RouterService } from '../../../../services/router.service';
import { SortType } from '../../../../commons/enums/sort.enum';
import { UserExportPopupComponent } from '../user-export-popup/user-export-popup.component';
import { UserService } from '../../../../services/user/user.service';
import { UserType } from '../../../../commons/enums/user.enum';
import { UserViewModel } from '../../../../models/admin-space/user.model';
import { zip } from 'rxjs';

enum SearchBy {
  None = 0,
  StartedWorking = 1,
  Terminated = 2,
  Blocked = 3,
  Birthday = 4
}

enum ColumnName {
  EmployeeCode = 1,
  EmployeeName = 2,
  Branch = 3,
  Birthday = 4,
  Username = 5,
  Email = 6,
  PhoneNumber = 7,
  Gender = 8,
  Address = 9,
  Status = 10
}

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html'
})
export class EmployeeManagementComponent implements OnInit {

  @Input() detailBranchId = 0;

  public loading = false;
  public DateFormat = DateFormat;
  public Message = Message;
  public avatarSize = 50;
  public avatarUrl = AppService.getPath(ApiController.CdnApi.UserAvatar + '{0}/' + this.avatarSize);

  public page = 1;
  public pageSize: number = PaginationComponent.getDefaultPageSize();
  public isAppearedCheckAll = false;
  public sortField: number = ColumnName.EmployeeCode;
  public sortType: number = SortType.ASC;
  public listBranch: DropDownData[] = [];
  public listEmployeeStatus: DropDownData[] = [];
  public listSearchBy: DropDownData[] = [];
  public listEmployee: PagedListModel<EmployeeList>;
  public listEmployeeIdSelected: number[] = [];

  // Filters
  public searchFor = '';
  public branchSelected = 0;
  public statusSelected = EmployeeStatusCode.All.toString();
  public searchBySelected: number = SearchBy.None;
  public startDate = MomentHelper.startDateOfMonth().format(DateFormat.DateFormatJson);
  public endDate = MomentHelper.endDateOfMonth().format(DateFormat.DateFormatJson);

  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private dialogService: DialogService,
    private routerService: RouterService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.branchSelected = this.detailBranchId;
    this.initFilter();
    this.getListEmployee(1, this.pageSize);
  }

  private initFilter() {

    // Employee Status
    this.listEmployeeStatus.push(
      new DropDownData(EmployeeStatus.All.toString(), 'All'),
      new DropDownData(EmployeeStatus.Working.toString(), 'Working'),
      new DropDownData(EmployeeStatus.Terminated.toString(), 'Terminated'),
      new DropDownData(EmployeeStatus.Blocked.toString(), 'Blocked'));

    // Search by
    this.listSearchBy.push(
      new DropDownData(SearchBy.None, 'None', null, true),
      new DropDownData(SearchBy.StartedWorking, 'Started Working Date'),
      new DropDownData(SearchBy.Terminated, 'Terminated Date'),
      new DropDownData(SearchBy.Blocked, 'Blocked Date'),
      new DropDownData(SearchBy.Birthday, 'Birthday'));

    // Branch List
    this.listBranch.push(
      new DropDownData(0, 'All branchs', null, true),
      new DropDownData(null, 'None', null, true));

    zip(this.branchService.getEnabledBranch()).pipe(
      map(([branchs]) => {
        if (branchs) {
          branchs.forEach((item) => {
            this.listBranch.push(new DropDownData(item.id.toString(), item.shortName, item.name));
          });
        }
      })
    ).subscribe();
  }

  public getListEmployee(page: number = 1, pageSize: number = PaginationComponent.getDefaultPageSize()): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;
    this.employeeService.getListEmployee(
      this.page,
      this.pageSize,
      this.sortField,
      this.sortType,
      this.branchSelected,
      this.statusSelected,
      this.searchBySelected,
      this.startDate ? MomentHelper.parseDateToString(this.startDate, null, DateFormat.DateFormatCSharp) : null,
      this.endDate ? MomentHelper.parseDateToString(this.endDate, null, DateFormat.DateFormatCSharp) : null,
      this.searchFor
    ).subscribe((res) => {
      this.listEmployee = res;
      this.handleAppearingCheckAll();
      this.loading = false;
    });
  }

  private handleAppearingCheckAll(): void {
    if (this.listEmployee && this.listEmployee.items) {
      this.listEmployee.items.forEach((item) => {
        if (this.listEmployeeIdSelected.some((x) => x === item.employeeId)) {
          item.selected = true;
        }
      });
      if (this.listEmployee.items.every((item) => this.listEmployeeIdSelected.some((x) => x === item.employeeId))) {
        this.isAppearedCheckAll = true;
      } else {
        this.isAppearedCheckAll = false;
      }
    }
  }

  public sortData(sortField: number, sortType: number): void {
    this.sortField = sortField;
    this.sortType = sortType;
    this.getListEmployee(this.page, this.pageSize);
  }

  public deleteEmployee(employeeId: number): void {
    this.loading = true;
    this.userService.deleteUser(employeeId).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.listEmployee.items = this.listEmployee.items.filter((item) => item.employeeId !== employeeId);
        this.notificationService.success(Message.EmployeeManagement.DELETE_EMPLOYEE_SUCCESS);
      }
    }, (err) => {
      this.loading = false;
      this.notificationService.error(Message.EmployeeManagement.DELETE_EMPLOYEE_FAIL);
    });
  }

  public onClickCheckedAllItem(event): void {
    if (event) {
      this.listEmployee.items.forEach((item) => {
        item.selected = true;
        if (!this.listEmployeeIdSelected.some(x => x === item.employeeId)) {
          this.listEmployeeIdSelected.push(item.employeeId);
        }
      });
    } else {
      this.listEmployee.items.forEach((item) => {
        item.selected = false;
        this.listEmployeeIdSelected = this.listEmployeeIdSelected.filter((x) => x !== item.employeeId);
      });
    }
    this.isAppearedCheckAll = event;
  }

  public onClickCheckedItem(event, index): void {
    if (event) {
      this.listEmployeeIdSelected.push(this.listEmployee.items[index].employeeId);
    } else {
      this.listEmployeeIdSelected = this.listEmployeeIdSelected
        .filter((item) => item !== this.listEmployee.items[index].employeeId);
    }
    this.listEmployee.items[index].selected = event;
    this.handleAppearingCheckAll();
  }

  public onExport(): void {
    const searchCondition: any[] = [];
    searchCondition.push(this.sortField);
    searchCondition.push(this.sortType);
    searchCondition.push(this.branchSelected);
    searchCondition.push(this.statusSelected);
    searchCondition.push(this.searchBySelected);
    searchCondition.push(this.startDate ? MomentHelper.parseDateToString(this.startDate, null, DateFormat.DateFormatCSharp) : null);
    searchCondition.push(this.endDate ? MomentHelper.parseDateToString(this.endDate, null, DateFormat.DateFormatCSharp) : null);
    searchCondition.push(this.searchFor);
    this.dialogService.addDialog(UserExportPopupComponent, {
      userType: UserType.Employee,
      selectedUserIds: this.listEmployeeIdSelected,
      searchCondition
    }).subscribe();
  }

  public parseDateToString(date: string): string {
    return MomentHelper.parseDateToString(date);
  }

  public onClickViewUserProfile(id: number): void {
    this.routerService.userInfo(id);
  }

  public getBranchByBranchId(branchId: number): string {
    if (!branchId) {
      return 'N/A';
    }
    const branch = this.listBranch.find(item => item.key === branchId.toString());
    return branch ? branch.value : 'N/A';
  }

  public onClickAddEmployee() {
    this.dialogService.addDialog(AddUserPopupComponent, {
      isEmployee: true
    }).subscribe((res: UserViewModel) => {
      if (res) {
        this.getListEmployee();
        this.notificationService.success(Message.SaveSuccess);
      }
    });
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }
}
