import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { CsmsOrder, CsmsOrderDetail } from '../../../../models/order/order.model';
import { EnableProductViewModel } from '../../../../models/product/product-list';
import { OrderService } from '../../../../services/order/order.service';
import { NotificationService } from '../../../../services/notification.service';
import { Message } from '../../../../commons/consts/message.const';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { AppService } from '../../../../configs/app-service';
import { ApiController } from '../../../../commons/consts/api-controller.const';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html'
})
export class NewOrderComponent extends DialogComponent<any, any>  {
  public loading = false;
  public SpinnerColor = SpinnerColor;
  public SpinnerType = SpinnerType;
  public photoUrl = AppService.getPath(ApiController.CdnApi.ProductPhoto + '{0}/{1}');
  public products: EnableProductViewModel[] = [];
  public productSelected: CsmsOrderDetail[] = [];
  public order: CsmsOrder;

  constructor(
    public dialogService: DialogService,
    private orderService: OrderService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  public onAddNewInvoice(): void {
    this.loading = true;
    this.order.merchandiseSubtotal = this.order.total;
    this.orderService.addNewOrder(this.order).subscribe(
      (res) => {
        if (res) {
          this.result = res;
          this.close();
        }
      }, (err) => {
        this.loading = false;
        this.notificationService.error(Message.SaveFail);
      }
    )
  }

  public addProduct(prod: EnableProductViewModel): void {

    const proIndex = this.order.orderDetails.findIndex(item => item.productId === prod.id);

    if (proIndex > -1) {
      this.order.orderDetails[proIndex].quantity = this.order.orderDetails[proIndex].quantity + 1;
    } else {
      const product = new CsmsOrderDetail();
      product.productId = prod.id;
      product.productName = prod.name;
      product.quantity = 1;
      product.categoryId = prod.categoryId;
      product.categoryName = prod.categoryName;
      product.photoId = prod.avatarId;
      product.price = prod.price;

      this.order.orderDetails.push(product);
    }

    this.order.total = this.order.orderDetails.map(item => item.quantity * item.price).reduce((a, b) => a + b, 0);
  }

  public getProductPhotoUrl(imageId: number = 0) {
    return this.photoUrl.replace('{0}', imageId.toString()).replace('{1}', '200');
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput) {
      return '0 ₫';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }
}
