import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { DialogService, DialogComponent } from 'angularx-bootstrap-modal';
import { NotificationService } from '../../../../services/notification.service';
import { CsmsUserAddress, AddressViewModel } from '../../../../models/admin-space/user.model';
import { SpinnerType, SpinnerColor } from '../../../../commons/consts/spinner.const';
import { Message } from '../../../../commons/consts/message.const';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationService } from '../../../../services/system/location.service';

@Component({
  selector: 'app-user-address-popup',
  templateUrl: './user-address-popup.component.html'
})
export class UserAddressPopupComponent extends DialogComponent<any, any> {

  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;

  public address: AddressViewModel;
  public userId: number;
  public listCountry: DropDownData[] = [];
  public listProvince: DropDownData[] = [];
  public listDistrict: DropDownData[] = [];
  public listWard: DropDownData[] = [];

  constructor(
    public dialogService: DialogService,
    private userService: UserService,
    private locationService: LocationService,
    private notificationService: NotificationService) {
    super(dialogService);
    this.initData();
  }

  private initData(): void {
    this.listCountry = [
      new DropDownData('Việt Nam', 'Việt Nam')
    ];

    zip(this.locationService.getAllProvinces()).pipe(
      map(([provinces]) => {
        if (provinces) {
          const temp: DropDownData[] = [];
          provinces.forEach((item) => {
            temp.push(new DropDownData(item.id.toString(), item.name));
          });
          this.listProvince = temp;
        }
      })
    ).subscribe();
  }

  public onSave(): void {
    this.loading = true;
    if (!this.isDataValid()) {
      this.loading = false;
      return;
    }

    const csmsAddress: CsmsUserAddress = new CsmsUserAddress(this.userId, this.address);
    this.userService.saveUserAddress(csmsAddress).subscribe(
      (res) => {
        if (res) {
          this.result = res;
          this.close();
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      });
  }

  public onCancel(): void {
    this.result = undefined;
    this.close();
  }

  private isDataValid(): boolean {
    if (!this.address
      || !this.address.receiver
      || !this.address.phoneNumber
      || !this.address.country
      || !this.address.province
      || !this.address.district
      || !this.address.ward) {
      this.error = true;
      this.errorMessage = 'Some data cannot null';

      return false;
    }

    this.error = false;
    return true;
  }

  public onChooseProvince(provinceDropDown: DropDownData): void {
    this.address.province = provinceDropDown.value;
    this.listDistrict = [];
    this.locationService.getListDistrictByProvinceId(provinceDropDown.key).subscribe((res) => {
      if (res) {
        const temp: DropDownData[] = [];
        res.forEach((item) => {
          temp.push(new DropDownData(item.id.toString(), item.name));
        });
        this.listDistrict = temp;
      }
    });
  }

  public onChooseDistrict(districtDropDown: DropDownData): void {
    this.address.district = districtDropDown.value;
    this.listWard = [];
    this.locationService.getListWardByDistrictId(districtDropDown.key).subscribe((res) => {
      if (res) {
        const temp: DropDownData[] = [];
        res.forEach((item) => {
          temp.push(new DropDownData(item.id.toString(), item.name));
        });
        this.listWard = temp;
      }
    });
  }
}
