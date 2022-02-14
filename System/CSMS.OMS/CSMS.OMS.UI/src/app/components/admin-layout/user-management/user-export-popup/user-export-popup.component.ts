import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { Message } from '../../../../commons/consts/message.const';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../../services/notification.service';
import { UserManagementService } from '../../../../services/user/user-management.service';
import { UserType } from '../../../../commons/enums/user.enum';
import { SpinnerType, SpinnerColor } from '../../../../commons/consts/spinner.const';

enum ExportUserType {
  SelectedUsers = 1,
  SearchResult = 2,
}

enum ExportUserFile {
  Employee = 'Employee_',
  EmployeeResult = 'Employee_SearchResult_',
  Customer = 'Customer_',
  CustomerResult = 'Customer_SearchResult_',
}

@Component({
  selector: 'app-user-export-popup',
  templateUrl: './user-export-popup.component.html'
})
export class UserExportPopupComponent extends DialogComponent<any, any> implements OnInit {

  public isWaiting = false;
  public userType = 0;
  public ExportUserType = ExportUserType;
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;

  public selectedTypeToExport: number;
  public selectedUserIds: number[] = [];
  private searchCondition: any[] = [];

  constructor(
    public dialogService: DialogService,
    private userManagementService: UserManagementService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  ngOnInit() {
    if (this.selectedUserIds.length === 0) {
      this.selectedTypeToExport = ExportUserType.SearchResult;
    } else {
      this.selectedTypeToExport = ExportUserType.SelectedUsers;
    }
  }

  public onExport() {
    this.isWaiting = true;
    this.userManagementService.exportUsers(
      this.userType,
      this.selectedUserIds,
      this.selectedTypeToExport,
      this.searchCondition.join(';')).subscribe((res) => {
        if (res) {
          this.isWaiting = false;
          const date: any = MomentHelper.formatDate(moment(), DateFormat.DateFormatCSharp);
          const data: any = res;
          const blob: any = new Blob([data], { type: data.type });
          const a: any = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          switch (this.selectedTypeToExport) {
            case ExportUserType.SelectedUsers:
              switch (this.userType) {
                case UserType.Customer:
                  a.download = ExportUserFile.Customer + date + '.xlsx';
                  break;
                case UserType.Employee:
                  a.download = ExportUserFile.Employee + date + '.xlsx';
                  break;
              }
              break;
            case ExportUserType.SearchResult:
              switch (this.userType) {
                case UserType.Customer:
                  a.download = ExportUserFile.CustomerResult + date + '.xlsx';
                  break;
                case UserType.Employee:
                  a.download = ExportUserFile.EmployeeResult + date + '.xlsx';
                  break;
              }
              break;
          }
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.notificationService.success(Message.EXPORT_SUCCESS);
          setTimeout(() => {
            this.close();
          }, 1000);
        }
      }, (err) => {
        this.isWaiting = false;
        this.notificationService.error(Message.EXPORT_FAIL);
      });
  }

  public onChooseExportType(exportUserType: number) {
    this.selectedTypeToExport = exportUserType;
  }
}
