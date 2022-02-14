import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterService } from '../../../../../services/router.service';
import { WarehouseService } from '../../../../../services/warehouse/warehouse.service';
import { Message } from '../../../../../commons/consts/message.const';
import { StoreMaterialViewModel } from '../../../../../models/warehouse/warehouse.model';
import { NotificationService } from '../../../../../services/notification.service';

@Component({
  selector: 'app-store-warehouse',
  templateUrl: './store-warehouse.component.html'
})
export class StoreWarehouseComponent implements OnInit {

  public loading = false;
  public errorMessage: string;
  public branchIdSelected = 0;
  public oldValue: StoreMaterialViewModel[];
  public listStoreWarehouse: StoreMaterialViewModel[];

  constructor(
    private route: ActivatedRoute,
    private routerService: RouterService,
    private warehouseService: WarehouseService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params) {
        this.branchIdSelected = +params['id'];
        this.getStoreWarehouse();
      } else {
        this.routerService.notFound();
      }
    });
  }

  private getStoreWarehouse(): void {
    this.loading = true;
    if (this.branchIdSelected > 0) {
      this.warehouseService.getStoreWarehouse(this.branchIdSelected).subscribe(
        (res) => {
          this.loading = false;
          this.listStoreWarehouse = res;
          this.oldValue = res.map(x => Object.assign({}, x));
        }, (err) => {
          this.loading = false;
          this.errorMessage = Message.Error.SEVER_ERROR;
        }
      )
    }
  }

  public updateQuantity(quantity: number, index: number): void {
    const oldValue = this.oldValue[index].amount;
    this.listStoreWarehouse[index].amount = this.listStoreWarehouse[index].amount + quantity;

    if (this.listStoreWarehouse[index].amount < 0) {
      this.listStoreWarehouse[index].amount = 0;
    }
    if (this.listStoreWarehouse[index].amount > oldValue) {
      this.listStoreWarehouse[index].amount = oldValue
    }
  }

  public onSave(): void {
    this.loading = true;
    this.warehouseService.updateStoreWarehouse(this.listStoreWarehouse).subscribe(
      (res) => {
        this.loading = false;
        this.oldValue = this.listStoreWarehouse.map(x => Object.assign({}, x));
        this.notificationService.success(Message.SaveSuccess);
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      }
    )
  }
}
