import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { WarehouseMaterialViewModel } from '../../../../../models/warehouse/warehouse.model';
import { ExportMaterialViewModel } from '../../../../../models/warehouse/material.model';
import { WarehouseService } from '../../../../../services/warehouse/warehouse.service';
import { NotificationService } from '../../../../../services/notification.service';
import { DropDownData } from '../../../../commons/dropdown/dropdown.component';
import { Message } from '../../../../../commons/consts/message.const';
import { zip } from 'rxjs';
import { BranchService } from '../../../../../services/system/branch.service';
import { map } from 'rxjs/operators';
import { SpinnerColor, SpinnerType } from '../../../../../commons/consts/spinner.const';

@Component({
  selector: 'app-export-material-popup',
  templateUrl: './export-material-popup.component.html'
})
export class ExportMaterialPopupComponent extends DialogComponent<any, any> implements OnInit {

  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public materials: WarehouseMaterialViewModel[];
  public listStore: DropDownData[];

  private exportList: ExportMaterialViewModel[] = [];
  public storeIdSelected: number;
  public exportListSelected: ExportMaterialViewModel[];

  constructor(
    public dialogService: DialogService,
    private warehouseService: WarehouseService,
    private branchService: BranchService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  ngOnInit(): void {
    zip(
      this.warehouseService.getStoreExportDefault(),
      this.branchService.getEnabledBranch()
    ).pipe(
      map(
        ([storeExportDefaults, stores]) => {
          if (stores) {

            stores.forEach(sto => {
              this.materials.forEach(mat => {
                this.exportList.push(new ExportMaterialViewModel(
                  sto.id,
                  sto.name,
                  mat.materialId,
                  storeExportDefaults.find(def => def.branchId === sto.id && def.materialId === mat.materialId)
                    ? storeExportDefaults.find(def => def.branchId === sto.id && def.materialId === mat.materialId).quantityUnit
                    : 0
                ));
              });
            });

            this.listStore = stores.map(item => new DropDownData(item.id, item.shortName + ' - ' + item.name));
            this.storeIdSelected = stores[0].id;
            this.exportListSelected = this.exportList.filter(item => item.branchId === stores[0].id);
          }
        })
    ).subscribe();
  }

  public onSetDefault(): void {
    this.loading = true;
    this.warehouseService.setDefaultExportMaterial(this.exportListSelected).subscribe(
      (res) => {
        if (res) {
          this.result = false;
          this.notificationService.success(Message.SaveSuccess);
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      }
    )
  }

  public onExport(): void {
    this.loading = true;
    this.warehouseService.exportMaterial(this.exportListSelected).subscribe(
      (res) => {
        if (res) {
          this.result = true;
          this.close();
          this.notificationService.success(Message.SaveSuccess);
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      }
    )
  }

  public onSelectStore(storeId: number) {
    this.storeIdSelected = storeId;
    this.exportListSelected = this.exportList.filter(item => item.branchId === storeId);
  }

  public updateQuantity(quantity: number, index: number): void {
    if (this.exportListSelected[index].quantityUnit > 0 || quantity > 0) {
      this.exportListSelected[index].quantityUnit = +this.exportListSelected[index].quantityUnit + +quantity;
    }
  }
}
