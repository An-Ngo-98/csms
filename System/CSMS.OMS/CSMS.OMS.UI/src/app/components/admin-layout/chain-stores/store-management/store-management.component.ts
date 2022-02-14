import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../../../../commons/consts/message.const';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { CsmsBranch } from '../../../../models/system-data/branch.model';
import { PagedListModel } from 'app/models/app';
import { BranchService } from '../../../../services/system/branch.service';
import { NotificationService } from '../../../../services/notification.service';
import { PaginationComponent } from '../../../commons/pagination/pagination.component';
import { AddEditStorePopupComponent } from './add-edit-store-popup/add-edit-store-popup.component';
import { DialogService } from 'angularx-bootstrap-modal';
import { AppService } from '../../../../configs/app-service';
import { ApiController } from '../../../../commons/consts/api-controller.const';
import { RouterService } from '../../../../services/router.service';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html'
})
export class StoreManagementComponent implements OnInit {

  private photoSize = 250;
  private photoUrl = AppService.getPath(ApiController.CdnApi.Stores + '{0}' + '?size={1}');

  public loading = false;
  public loadingList = false;
  public Message = Message;
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public page = 1;
  public pageSize = 8;
  public listPageSize = [4, 8, 16, 40, 80];

  public listBranch: PagedListModel<CsmsBranch>;

  @ViewChild('inputName', { static: false }) inputElement: ElementRef;

  constructor(
    private dialogService: DialogService,
    private branchService: BranchService,
    private routerService: RouterService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.getListBranch(1, this.pageSize);
  }

  public getListBranch(page = 1, pageSize = this.pageSize): void {
    this.page = page;
    this.pageSize = pageSize;
    this.loadingList = true;
    this.branchService.getListBranch(page, pageSize).subscribe(
      (res) => {
        this.loadingList = false;
        this.listBranch = res;
      }, (err) => {
        this.loadingList = false;
        this.notificationService.error(Message.CategoryManagement.LOAD_CATEGORY_LIST_FAIL);
      }
    )
  }

  public onDelete(branchId: number): void {
    if (branchId) {
      this.loading = true;
      this.branchService.deleteBranch(branchId).subscribe(
        (res) => {
          if (res) {
            this.loading = false;
            this.listBranch.items = this.listBranch.items.filter((item) => item.id !== branchId);
          }
        }, (err) => {
          this.loading = false;
          this.notificationService.error(Message.BranchManagement.DELETE_BRANCH_FAIL);
        });
    }
  }

  public onClickAddEditStore(store: CsmsBranch, index: number = null): void {
    this.dialogService.addDialog(AddEditStorePopupComponent, {
      store: store ? Object.assign({}, store) : new CsmsBranch()
    }).subscribe(
      (res) => {
        if (res && res.id !== 0) {
          if (index !== null) {
            this.listBranch.items[index] = res;
          } else {
            this.listBranch.items.push(res);
          }
          this.notificationService.success(Message.BranchManagement.SAVE_BRANCH_FAIL);
        }
      }
    );
  }

  public onGetAddress(branch: CsmsBranch): string {
    if (!branch) {
      return 'N/A';
    }

    const address: string[] = [];
    if (branch.add_Detail) {
      address.push(branch.add_Detail);
    }
    if (branch.add_Ward) {
      address.push(branch.add_Ward);
    }
    if (branch.add_District) {
      address.push(branch.add_District);
    }
    if (branch.add_Province) {
      address.push(branch.add_Province);
    }

    return address.length === 0 ? 'N/A' : address.join(', ');
  }

  public onViewDetail(storeId: number): void {
    this.routerService.storeDetail(storeId);
  }

  public getOpenTime(branch: CsmsBranch): string {
    let result = '';
    if (branch.openTime) {
      const hour = +branch.openTime.split(':')[0];
      const mins = +branch.openTime.split(':')[1];
      result += hour > 12 ? hour - 12 : hour;
      result += ':' + (mins > 9 ? mins : ('0' + mins));
      result += hour > 12 ? ' PM' : ' AM' + ' - '
    } else {
      result += 'N/A - '
    }

    if (branch.closeTime) {
      const hour = +branch.closeTime.split(':')[0];
      const mins = +branch.closeTime.split(':')[1];
      result += hour > 12 ? hour - 12 : hour;
      result += ':' + (mins > 9 ? mins : ('0' + mins));
      result += hour > 12 ? ' PM' : ' AM' + ' - '
    } else {
      result += 'N/A'
    }

    return result;
  }

  public getPhotoUrl(imageId: number = 0, isNewPhoto: string = null, size = this.photoSize) {
    let result = this.photoUrl.replace('{0}', imageId.toString()).replace('{1}', size.toString());
    result += isNewPhoto ? '&reload=' + isNewPhoto : '';

    return result;
  }
}
