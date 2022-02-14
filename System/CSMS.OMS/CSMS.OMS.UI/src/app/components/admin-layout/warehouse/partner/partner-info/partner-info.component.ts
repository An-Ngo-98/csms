import { Component, OnInit } from '@angular/core';
import { PartnerViewModel, PartnerMaterialViewModel } from '../../../../../models/warehouse/partner.model';
import { SpinnerColor, SpinnerType } from '../../../../../commons/consts/spinner.const';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../../../../services/router.service';
import { PartnerService } from '../../../../../services/warehouse/partner.service';
import { NotificationService } from '../../../../../services/notification.service';
import { Message } from '../../../../../commons/consts/message.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { AddPartnerMaterialPopupComponent } from './add-partner-material-popup/add-partner-material-popup.component';
import { MaterialViewModel } from '../../../../../models/warehouse/material.model';

@Component({
  selector: 'app-partner-info',
  templateUrl: './partner-info.component.html'
})
export class PartnerInfoComponent implements OnInit {

  public error = false;
  public loading = false;
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public partner: PartnerViewModel = new PartnerViewModel();

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private partnerService: PartnerService,
    private dialogService: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params) {
        if (params['id'] !== 'new') {
          this.partner.id = +params['id'];
          this.initData();
        }
      } else {
        this.routerService.notFound();
      }
    });
  }

  public onSave(): void {
    this.loading = true;
    if (!this.isDataValid()) {
      this.loading = false;
      return;
    }

    this.partnerService.savePartner(this.partner).subscribe(
      (res) => {
        if (res) {
          this.loading = false;
          this.partner = res;
          this.notificationService.success(Message.PartnerManagement.SAVE_PARTNER_SUCCESS);
          this.routerService.navigate('warehouse');
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.PartnerManagement.SAVE_PARTNER_FAIL);
      }
    )
  }

  public onAddEditMaterial(mat: PartnerMaterialViewModel = null, index: number = null): void {
    mat = mat ? mat : new PartnerMaterialViewModel();
    this.dialogService.addDialog(AddPartnerMaterialPopupComponent, {
      material: mat,
      isNew: index === null ? true : false
    }).subscribe(
      (res: PartnerMaterialViewModel) => {
        if (res && res.materialId > 0) {
          if (index !== null) {
            this.partner.materials[index].price = res.price;
          } else {
            this.partner.materials.push(res);
          }
        }
      }
    );
  }

  public onBack(): void {
    this.routerService.navigate('warehouse');
  }

  private isDataValid(): boolean {
    if (!this.partner.name) {
      this.error = true;
      return false;
    }

    return true;
  }

  private initData() {
    this.loading = true;
    this.partnerService.getPartnerById(this.partner.id).subscribe((res) => {
      if (res) {
        this.loading = false;
        this.partner = res;
      } else {
        this.routerService.notFound();
      }
    });
  }

  public convertCurrency(price: number): string {
    if (!price) {
      return 'N/A';
    }

    return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public onDeleteMaterial(materialId: number): void {
    this.partner.materials = this.partner.materials.filter(item => item.materialId === materialId);
  }
}
