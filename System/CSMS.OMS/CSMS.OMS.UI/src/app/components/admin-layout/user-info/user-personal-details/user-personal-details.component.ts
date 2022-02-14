import * as fromRoot from '../../../../ngrx-store/reducers';
import { AddressViewModel, CsmsUserAddress, UserViewModel } from '../../../../models/admin-space/user.model';
import { BranchService } from '../../../../services/system/branch.service';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { EmployeeStatus } from '../../../../commons/consts/employee.const';
import { map } from 'rxjs/operators';
import { Message } from '../../../../commons/consts/message.const';
import { NotificationService } from '../../../../services/notification.service';
import { RoleIdConstant } from '../../../../commons/consts/permission.const';
import { RoleService } from '../../../../services/system/role.service';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { Store } from '@ngrx/store';
import { UserAddressPopupComponent } from '../user-address-popup/user-address-popup.component';
import { UserService } from '../../../../services/user/user.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html'
})
export class UserPersonalDetailsComponent implements OnInit {

  @Input() user: UserViewModel;

  public loading = false;
  public isEmployee = false;
  public isAdmin = false;
  public RoleIdConstant = RoleIdConstant;
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public Message = Message;
  public listRole: DropDownData[] = [];
  public listBranch: DropDownData[] = [];
  public listGender: DropDownData[] = [];
  public listEmployeeStatus: DropDownData[] = [];

  constructor(
    private store: Store<fromRoot.State>,
    private dialogService: DialogService,
    private userService: UserService,
    private branchService: BranchService,
    private roleService: RoleService,
    private notificationService: NotificationService) { }

  ngOnInit() {

    if (!this.user.roleId || this.user.roleId !== RoleIdConstant.Customer) {
      this.isEmployee = true;
    }
    this.store.select(fromRoot.getUserRoles).subscribe((res) => {
      this.isAdmin = res.find((item) => item.roleId === RoleIdConstant.Admin) ? true : false;
    });

    this.initData();
  }

  private initData() {

    this.listGender = [
      new DropDownData('Male', 'Male'),
      new DropDownData('Female', 'Female')
    ];

    this.listEmployeeStatus.push(
      new DropDownData(EmployeeStatus.Working, 'Working'),
      new DropDownData(EmployeeStatus.Blocked, 'Blocked'));

    if (this.isEmployee) {
      this.listEmployeeStatus.push(new DropDownData(EmployeeStatus.Terminated, 'Terminated'));
    }

    zip(
      this.branchService.getEnabledBranch(),
      this.roleService.getListRoleForSelect())
      .pipe(
        map(([branchs, roles]) => {

          // Branch List
          if (branchs) {
            const temp: DropDownData[] = [];
            branchs.forEach((item) => {
              temp.push(new DropDownData(item.id, item.shortName, item.name));
            });
            this.listBranch = temp;
          }

          // Role List
          if (roles) {
            const temp: DropDownData[] = [];
            roles.forEach((item) => {
              temp.push(new DropDownData(item.roleId, item.roleTitle));
            });
            this.listRole = temp;
          }

        })
      ).subscribe();
  }

  public getAddress(address: AddressViewModel): string {
    let result = address.detail ? address.detail + ', ' : '';
    result += address.ward + ', ' + address.district + ', ' + address.province;
    return result;
  }

  public onClickUpdateProfile() {
    this.loading = true;
    this.userService.saveUserInfo(this.user).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.user = res;
        this.notificationService.success(Message.UserInfo.UPDATE_INFO_SUCCESS);
      }
    }, (err) => {
      this.loading = false;
      this.notificationService.error(Message.UserInfo.UPDATE_INFO_FAIL);
    });
  }

  public onDeleteUserAddress(addressId: number) {

    this.userService.deleteUserAddress(addressId).subscribe((res) => {
      console.log(res);
      if (res && res.succeeded) {
        this.user.addresses = this.user.addresses.filter(item => item.id !== addressId);
        this.notificationService.success(Message.UserInfo.DELETE_ADDRESS_SUCCESS);
      } else {
        this.notificationService.error(Message.UserInfo.DELETE_ADDRESS_FAIL);
      }
    }, (err) => {
      this.notificationService.error(Message.UserInfo.DELETE_ADDRESS_FAIL);
    });
  }

  public onClickAddEditAddress(address: AddressViewModel) {
    const isNew = !address ? true : false;
    this.dialogService.addDialog(UserAddressPopupComponent, {
      userId: this.user.id,
      address: address ? Object.assign({}, address) : new AddressViewModel()
    }).subscribe((res: AddressViewModel) => {
      if (res) {
        if (isNew) {
          this.user.addresses.push(res);
        } else {
          this.user.addresses.forEach((item, index) => {
            if (item.id === res.id) {
              this.user.addresses[index] = res;
            }
          });
        }

        if (res.isDefault) {
          this.user.addresses.forEach(item => {
            if (item.id !== res.id && item.isDefault) {
              item.isDefault = false;
            }
          });
        } else if (this.user.addresses.length === 1) {
          this.user.addresses[0].isDefault = true;
        }

        this.notificationService.success(Message.SaveSuccess);
      }
    });
  }

  public onClickSetDeFault(address: AddressViewModel) {
    const csmsAddress: CsmsUserAddress = new CsmsUserAddress(this.user.id, address);
    csmsAddress.isDefault = true;
    this.userService.saveUserAddress(csmsAddress).subscribe(
      (res) => {
        if (res) {
          this.user.addresses.forEach(item => {
            if (item.id !== res.id) {
              item.isDefault = false;
            } else {
              item.isDefault = true;
            }
          });
        }
      }, (err) => {
        this.notificationService.error(Message.SaveFail);
      });
  }
}
