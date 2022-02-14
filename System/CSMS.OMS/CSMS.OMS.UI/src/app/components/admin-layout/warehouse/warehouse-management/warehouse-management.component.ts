import { Component, OnInit } from '@angular/core';
import { DialogService } from 'angularx-bootstrap-modal';
import { ImportMaterialPopupComponent } from './import-material-popup/import-material-popup.component';
import { Message } from '../../../../commons/consts/message.const';
import { NotificationService } from '../../../../services/notification.service';
import { WarehouseMaterialViewModel, WarehousePartnerViewModel } from '../../../../models/warehouse/warehouse.model';
import { WarehouseService } from '../../../../services/warehouse/warehouse.service';
import { ExportMaterialPopupComponent } from './export-material-popup/export-material-popup.component';
import { ImportExportHistoryPopupComponent } from './import-export-history-popup/import-export-history-popup.component';

@Component({
  selector: 'app-warehouse-management',
  templateUrl: './warehouse-management.component.html'
})
export class WarehouseManagementComponent implements OnInit {

  public loading = false;
  public searchString = '';
  public listMaterial: WarehouseMaterialViewModel[];

  constructor(
    private warehouseService: WarehouseService,
    private dialogService: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getListMaterial();
  }

  public getListMaterial(): void {
    this.loading = true;
    this.warehouseService.getWarehouseMaterial().subscribe(
      (res) => {
        this.listMaterial = res;
        this.loading = false;
      },
      (err) => {
        this.notificationService.error(Message.WarehouseManagement.LOAD_MATERIAL_FAIL);
        this.loading = false;
      });
  }

  public onImport(): void {
    this.dialogService.addDialog(ImportMaterialPopupComponent, {
      materials: this.listMaterial
    }).subscribe(
      (res: boolean) => {
        if (res === true) {
          this.getListMaterial();
        }
      }
    );
  }

  public onExport(): void {
    this.dialogService.addDialog(ExportMaterialPopupComponent, {
      materials: this.listMaterial
    }).subscribe(
      (res: boolean) => {
        if (res === true) {
          this.getListMaterial();
        }
      }
    );
  }

  public onViewHistories(materialId: number): void {
    this.dialogService.addDialog(ImportExportHistoryPopupComponent, { materialId: materialId }).subscribe();
  }

  public getPartner(partnerId: number, partners: WarehousePartnerViewModel[]): WarehousePartnerViewModel {
    return partners.find(item => item.partnerId === partnerId);
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }
}
