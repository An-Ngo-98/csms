import { Component } from '@angular/core';
import { CsmsMaterial } from '../../../../../models/warehouse/material.model';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { MaterialService } from '../../../../../services/warehouse/material.service';
import { Message } from '../../../../../commons/consts/message.const';
import { NotificationService } from '../../../../../services/notification.service';
import { SpinnerColor, SpinnerType } from '../../../../../commons/consts/spinner.const';

@Component({
  selector: 'app-add-edit-material-popup',
  templateUrl: './add-edit-material-popup.component.html'
})
export class AddEditMaterialPopupComponent extends DialogComponent<any, any> {

  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;

  public material: CsmsMaterial;

  constructor(
    public dialogService: DialogService,
    private materialService: MaterialService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  public onSave(): void {
    this.loading = true;
    if (!this.isDataValid()) {
      this.loading = false;
      return;
    }

    this.materialService.saveMaterial(this.material).subscribe(
      (res) => {
        if (res) {
          this.result = res;
          this.close();
          this.notificationService.success(Message.MaterialManagement.SAVE_MATERIAL_SUCCESS);
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.MaterialManagement.SAVE_MATERIAL_FAIL);
      }
    )
  }

  private isDataValid(): boolean {
    if (!this.material.name) {
      this.error = true;
      this.errorMessage = 'Material name cannot empty';

      return false;
    }

    if (!this.material.unit) {
      this.error = true;
      this.errorMessage = 'Material unit cannot empty';

      return false;
    }

    this.error = false;
    return true;
  }
}
