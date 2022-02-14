import { BranchService } from '../../../../services/system/branch.service';
import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { LocationService } from '../../../../services/system/location.service';
import { map } from 'rxjs/operators';
import { Message } from '../../../../commons/consts/message.const';
import { NotificationService } from '../../../../services/notification.service';
import { RoleIdConstant } from '../../../../commons/consts/permission.const';
import { RoleService } from '../../../../services/system/role.service';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { UserService } from '../../../../services/user/user.service';
import { UserViewModel } from '../../../../models/admin-space/user.model';
import { zip } from 'rxjs';

@Component({
  selector: 'app-add-user-popup',
  templateUrl: './add-user-popup.component.html'
})
export class AddUserPopupComponent extends DialogComponent<any, any> implements OnInit {

  public isEmployee = false;
  public user: UserViewModel;
  public avatar: File;
  public avatarUrl: string | ArrayBuffer;
  public error = false;
  public errorMessage = '';
  public loading = false;
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public listRole: DropDownData[] = [];
  public listBranch: DropDownData[] = [];
  public listGender: DropDownData[] = [];

  ngOnInit(): void {
    this.user = new UserViewModel();

    if (!this.isEmployee) {
      this.user.roleId = RoleIdConstant.Customer;
    }
  }

  constructor(
    public dialogService: DialogService,
    private userService: UserService,
    private locationService: LocationService,
    private branchService: BranchService,
    private roleService: RoleService,
    private notificationService: NotificationService) {
    super(dialogService);
    this.initData();
  }

  public onSave() {
    this.loading = true;
    if (!this.isValidData()) {
      this.loading = false;
      return;
    }

    this.userService.saveUserInfo(this.user).subscribe(
      (res) => {
        if (res) {
          this.userService.updateUserAvatar(res.id, this.avatar).subscribe();
          this.result = res;
          this.close();
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      });
  }

  public onSelectAvatar(files: FileList) {
    if (files.length === 0) {
      return;
    }

    const fileType = files[0].type;
    if (fileType.match(/image\/*/) === null) {
      this.errorMessage = 'Only images are supported';
      return;
    }

    this.avatar = files.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.avatarUrl = reader.result;
    }
  }

  private initData(): void {

    // Gender list
    this.listGender.push(
      new DropDownData('Male', 'Male'),
      new DropDownData('Female', 'Female'));

    zip(
      this.branchService.getEnabledBranch(),
      this.roleService.getListRole())
      .pipe(
        map(([branchs, roles]) => {

          // Branch List
          if (branchs) {
            branchs.forEach((item) => {
              this.listBranch.push(new DropDownData(item.id.toString(), item.shortName, item.name));
            });
          }

          // Role List
          if (roles) {
            roles.forEach((item) => {
              this.listRole.push(new DropDownData(item.roleId.toString(), item.roleTitle));
            });
          }

        })
      ).subscribe();
  }

  private isValidData(): boolean {

    if (!this.user.firstName
      || !this.user.lastName
      || !this.user.userName
      || !this.user.password) {
      this.error = true;
      this.errorMessage = 'Some field cannot null';
      return false;
    }

    return true;
  }
}
