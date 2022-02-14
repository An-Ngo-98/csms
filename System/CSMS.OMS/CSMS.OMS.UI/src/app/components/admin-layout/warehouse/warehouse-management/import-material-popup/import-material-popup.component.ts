import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { ImportMaterialViewModel } from '../../../../../models/warehouse/material.model';
import { WarehouseMaterialViewModel } from '../../../../../models/warehouse/warehouse.model';
import { WarehouseService } from '../../../../../services/warehouse/warehouse.service';
import { DropDownData } from '../../../../commons/dropdown/dropdown.component';
import { NotificationService } from '../../../../../services/notification.service';
import { Message } from '../../../../../commons/consts/message.const';
import { SpinnerColor, SpinnerType } from '../../../../../commons/consts/spinner.const';

@Component({
  selector: 'app-import-material-popup',
  templateUrl: './import-material-popup.component.html'
})
export class ImportMaterialPopupComponent extends DialogComponent<any, any> implements OnInit {

  public loading = false;
  public error = false;
  public errorMessage = '';
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public materials: WarehouseMaterialViewModel[];
  public importList: ImportMaterialViewModel[] = [];

  constructor(
    public dialogService: DialogService,
    private warehouseService: WarehouseService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.materials.forEach(mat => {
      const defaultPartner = mat.partners.find(item => item.partnerId === mat.defaultPartnerId);
      const temp = new ImportMaterialViewModel();
      temp.materialId = mat.materialId;
      temp.partnerId = mat.defaultPartnerId;
      temp.price = defaultPartner ? defaultPartner.materialPrice : undefined;
      temp.quantityUnit = mat.defaultQuantity;
      this.importList.push(temp);

      mat.dropDownData = [];
      mat.partners.forEach(item => {
        mat.dropDownData.push(new DropDownData(item.partnerId, item.partnerName));
      });
    });
  }

  public onSetDefault(): void {
    this.loading = true;
    this.warehouseService.setDefaultImportMaterial(this.importList).subscribe(
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

  public onImport(): void {
    this.loading = true;
    this.error = false;
    this.importList.forEach(item => {
      if (item.quantityUnit > 0 && !item.partnerId) {
        this.error = true;
        this.errorMessage = 'Partner is required';
      }
    });
    if (this.error) {
      return;
    }
    this.warehouseService.importMaterial(this.importList).subscribe(
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

  public onSelectPartner(partnerId: number, index: number) {
    const partner = this.materials[index].partners.find(item => item.partnerId == partnerId);
    this.importList[index].partnerId = partner.partnerId;
    this.importList[index].price = partner.materialPrice;
  }

  public updateQuantity(quantity: number, index: number): void {
    this.importList[index].quantityUnit = +this.importList[index].quantityUnit + +quantity;
    this.importList[index].quantityUnit = this.importList[index].quantityUnit < 0 ? 0 : this.importList[index].quantityUnit;
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public getTotal(): string {
    const total = this.importList.map(item => item.quantityUnit * item.price).reduce((a, b) => a + (b ? b : 0), 0);
    return this.formatCurrency(total);
  }
}
