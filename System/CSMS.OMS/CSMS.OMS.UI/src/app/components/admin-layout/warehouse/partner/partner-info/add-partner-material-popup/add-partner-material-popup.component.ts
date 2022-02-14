import { Component } from '@angular/core';
import { MaterialViewModel } from '../../../../../../models/warehouse';
import { MaterialService } from '../../../../../../services/warehouse/material.service';
import { SpinnerType, SpinnerColor } from '../../../../../../commons/consts/spinner.const';
import { DialogService, DialogComponent } from 'angularx-bootstrap-modal';
import { PartnerMaterialViewModel } from '../../../../../../models/warehouse/partner.model';
import { DropDownData } from '../../../../../commons/dropdown/dropdown.component';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-partner-material-popup',
  templateUrl: './add-partner-material-popup.component.html'
})
export class AddPartnerMaterialPopupComponent extends DialogComponent<any, any> {
  public loading = false;
  public error = false;
  public errorMessage = '';
  public isNew = true;
  public listMaterial: DropDownData[] = [];
  public material: PartnerMaterialViewModel;
  public materials: MaterialViewModel[] = [];

  constructor(
    public dialogService: DialogService,
    private materialService: MaterialService) {
    super(dialogService);
    this.initData();
  }

  private initData(): void {
    zip(this.materialService.getListMaterial()).pipe(
      map(([materials]) => {
        if (materials) {
          this.materials = materials.items;
          materials.items.forEach((item) => {
            this.listMaterial.push(new DropDownData(item.id.toString(), item.name + ' (' + item.unit + ')'));
          });
        }
      })
    ).subscribe();
  }

  public onSelect(id: string): void {
    const mat = this.materials.find(item => item.id === +id);
    if (!mat) {
      return;
    }

    this.material.materialId = mat.id;
    this.material.name = mat.name;
    this.material.unit = mat.unit;
    this.material.amount = mat.amount;
  }

  public onAdd(): void {
    if (!this.isDataValid()) {
      this.loading = false;
      return;
    }

    this.result = this.material;
    this.close();
  }

  private isDataValid(): boolean {
    if (!this.material.materialId) {
      this.error = true;
      this.errorMessage = 'Material cannot empty';

      return false;
    }

    if (!this.material.price) {
      this.error = true;
      this.errorMessage = 'Material price cannot empty';

      return false;
    }

    this.error = false;
    return true;
  }
}
