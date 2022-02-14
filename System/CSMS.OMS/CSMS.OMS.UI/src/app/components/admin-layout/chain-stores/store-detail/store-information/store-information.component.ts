import { Component } from '@angular/core';
import { AppService } from '../../../../../configs/app-service';
import { ApiController } from '../../../../../commons/consts/api-controller.const';
import { SpinnerType, SpinnerColor } from '../../../../../commons/consts/spinner.const';
import { Message } from '../../../../../commons/consts/message.const';
import { DropDownData } from '../../../../commons/dropdown/dropdown.component';
import { CsmsBranch } from '../../../../../models/system-data/branch.model';
import { LocationService } from '../../../../../services/system/location.service';
import { BranchService } from '../../../../../services/system/branch.service';
import { NotificationService } from '../../../../../services/notification.service';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogService } from 'angularx-bootstrap-modal';
import { SelectPositionMapPopupComponent } from '../../store-management/select-position-map-popup/select-position-map-popup.component';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../../../../services/router.service';

@Component({
  selector: 'app-store-information',
  templateUrl: './store-information.component.html'
})
export class StoreInformationComponent {
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

  public storeId: number;
  public store: CsmsBranch;

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    public dialogService: DialogService,
    private locationService: LocationService,
    private branchService: BranchService,
    private notificationService: NotificationService) {

    this.route.params.subscribe(params => {
      if (params) {
        this.storeId = +params['id'];
      } else {
        this.routerService.notFound();
      }
    });

    zip(this.locationService.getAllProvinces(), this.branchService.getListBranch(1, 1000)).pipe(
      map(([provinces, branch]) => {
        if (provinces) {
          const temp: DropDownData[] = [];
          provinces.forEach((item) => {
            temp.push(new DropDownData(item.id.toString(), item.name));
          });
          this.listProvince = temp;
        }
        if (branch) {
          this.store = branch.items.find(item => item.id === this.storeId);
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

    this.branchService.saveBranch(this.store).subscribe(
      (res) => {
        if (res) {
          if (this.newPhoto) {
            this.savePhoto(res.id);
          }
          this.loading = false;
          this.notificationService.success(Message.BranchManagement.SAVE_BRANCH_SUCCESS);
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
