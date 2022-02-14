import { AddEditMaterialPopupComponent } from './add-edit-material-popup/add-edit-material-popup.component';
import { Component, OnInit } from '@angular/core';
import { CsmsMaterial } from '../../../../models/warehouse/material.model';
import { DialogService } from 'angularx-bootstrap-modal';
import { MaterialService } from '../../../../services/warehouse/material.service';
import { MaterialViewModel } from '../../../../models/warehouse';
import { Message } from '../../../../commons/consts/message.const';
import { NotificationService } from '../../../../services/notification.service';
import { PagedListModel } from '../../../../models/app/paged-list.model';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html'
})
export class MaterialComponent implements OnInit {

  public loading = false;
  public page = 1;
  public pageSize = 10;

  public searchString = '';
  public listMaterial: PagedListModel<MaterialViewModel>;

  constructor(
    private materialService: MaterialService,
    private dialogService: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getListMaterial(1, this.pageSize);
  }

  public getListMaterial(page = 1, pageSize = this.pageSize): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;
    this.materialService.getListMaterial(
      this.page,
      this.pageSize,
      this.searchString
    ).subscribe(
      (res) => {
        this.listMaterial = res;
        this.loading = false;
      },
      (err) => {
        this.notificationService.error(Message.MaterialManagement.LOAD_MATERIAL_LIST_FAIL);
        this.loading = false;
      });
  }

  public onAddEditMaterial(material: MaterialViewModel = null, index: number = null): void {
    let isNew = false;
    const tempMaterial = new CsmsMaterial();
    if (!material) {
      isNew = true;
      material = new MaterialViewModel();
    } else {
      tempMaterial.id = material.id;
      tempMaterial.name = material.name;
      tempMaterial.unit = material.unit;
      tempMaterial.amount = material.amount;
    }

    this.dialogService.addDialog(AddEditMaterialPopupComponent, {
      material: tempMaterial
    }).subscribe(
      (res: CsmsMaterial) => {
        if (res && res.id !== 0) {

          material.id = res.id;
          material.name = res.name;
          material.unit = res.unit;
          material.amount = res.amount;

          if (index !== null) {
            this.listMaterial.items[index] = material;
          } else {
            this.listMaterial.items.push(material);
          }
        }
      }
    );
  }
}
