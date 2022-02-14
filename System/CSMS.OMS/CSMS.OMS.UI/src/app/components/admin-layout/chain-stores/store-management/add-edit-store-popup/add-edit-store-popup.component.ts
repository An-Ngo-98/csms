import { ApiController } from '../../../../../commons/consts/api-controller.const';
import { AppService } from '../../../../../configs/app-service';
import { BranchService } from '../../../../../services/system/branch.service';
import { Component } from '@angular/core';
import { CsmsBranch } from '../../../../../models/system-data/branch.model';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../../../commons/dropdown/dropdown.component';
import { LocationService } from '../../../../../services/system/location.service';
import { map } from 'rxjs/operators';
import { Message } from '../../../../../commons/consts/message.const';
import { NotificationService } from '../../../../../services/notification.service';
import { SpinnerColor, SpinnerType } from '../../../../../commons/consts/spinner.const';
import { zip } from 'rxjs';
import { SelectPositionMapPopupComponent } from '../select-position-map-popup/select-position-map-popup.component';

@Component({
  selector: 'app-add-edit-store-popup',
  templateUrl: './add-edit-store-popup.component.html'
})
export class AddEditStorePopupComponent extends DialogComponent<any, any> {

  private photoSizeList = 100;
  private photoUrl = AppService.getPath(ApiController.CdnApi.Stores + '{0}' + '?size={1}');

  // Product avatar
  private newPhoto: File;
  public newPhotoUrl: String | ArrayBuffer;

  // Variables
  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;
  public Message = Message;
  public listProvince: DropDownData[] = [];
  public listDistrict: DropDownData[] = [];
  public listWard: DropDownData[] = [];

  public store: CsmsBranch;

  constructor(
    public dialogService: DialogService,
    private locationService: LocationService,
    private branchService: BranchService,
    private notificationService: NotificationService) {
    super(dialogService);

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

    const isNew = this.store.id ? false : true;
    this.branchService.saveBranch(this.store).subscribe(
      (res) => {
        if (res) {
          if (this.newPhoto) {
            this.savePhoto(res.id);
            if (!isNew) {
              res.isNewPhoto = new Date().getTime().toString();
            }
          }
          this.result = res;
          this.close();
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.BranchManagement.SAVE_BRANCH_FAIL);
      });
  }

  private savePhoto(storeId) {
    this.branchService.saveBranchPhoto(storeId, this.newPhoto).subscribe(
      (res) => {
        this.newPhoto = null;
        this.newPhotoUrl = null;
      }, (err) => {
        this.newPhoto = null;
        this.newPhotoUrl = null;
        this.notificationService.error(Message.BranchManagement.SAVE_BRANCH_PHOTO_FAIL);
      }
    );
  }

  public onCancel(): void {
    this.result = undefined;
    this.close();
  }

  public onSelectLocation(): void {
    const lat = this.store.location ? parseFloat(this.store.location.split(' | ')[0]) : 0;
    const long = this.store.location ? parseFloat(this.store.location.split(' | ')[1]) : 0;
    this.dialogService.addDialog(SelectPositionMapPopupComponent, {
      latitude: lat,
      longitude: long,
      latitudeMap: lat,
      longitudeMap: long,
    }).subscribe(
        (res) => {
          if (res && res.length !== 0) {
            this.store.location = res;
          }
        }
      );
  }

  private isDataValid(): boolean {
    if (!this.store.shortName) {
      this.error = true;
      this.errorMessage = 'Short name cannot be empty';
      return false;
    }

    if (!this.store.name) {
      this.error = true;
      this.errorMessage = 'Name cannot be empty';
      return false;
    }

    this.error = false;
    return true;
  }

  public onChooseProvince(provinceDropDown: DropDownData): void {
    if (this.store.add_Province !== provinceDropDown.value) {
      this.store.add_Province = provinceDropDown.key ? provinceDropDown.value : null;
      this.listDistrict = [];
      this.listWard = [];
      this.store.add_District = null;
    }
    if (provinceDropDown.key) {
      this.locationService.getListDistrictByProvinceId(provinceDropDown.key).subscribe((res) => {
        if (res) {
          const temp: DropDownData[] = [];
          res.forEach((item) => {
            temp.push(new DropDownData(item.id.toString(), item.name));
          });
          this.listDistrict = temp;
        }
      });
    } else {
      this.store.add_District = null;
    }
  }

  public onChooseDistrict(districtDropDown: DropDownData): void {
    this.store.add_District = districtDropDown.key ? districtDropDown.value : null;
    this.listWard = [];
    if (districtDropDown.key) {
      this.locationService.getListWardByDistrictId(districtDropDown.key).subscribe((res) => {
        if (res) {
          const temp: DropDownData[] = [];
          res.forEach((item) => {
            temp.push(new DropDownData(item.id.toString(), item.name));
          });
          this.listWard = temp;
        }
      });
    } else {
      this.store.add_Ward = null;
    }
  }

  public getPhotoUrl(imageId: number = 0, isNewPhoto: string = null, size = this.photoSizeList) {
    let result = this.photoUrl.replace('{0}', imageId.toString()).replace('{1}', size.toString());
    result += isNewPhoto ? '&reload=' + isNewPhoto : '';

    return result;
  }

  public onUploadPhoto(files: FileList) {
    if (files.length === 0) {
      return;
    }

    const fileType = files[0].type;
    if (fileType.match(/image\/*/) === null) {
      this.errorMessage = 'Only images are supported';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.newPhoto = files.item(0);
      this.newPhotoUrl = reader.result;
    }
  }

}
