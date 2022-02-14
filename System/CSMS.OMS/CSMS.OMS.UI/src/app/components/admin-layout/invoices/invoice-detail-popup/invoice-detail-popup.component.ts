import { Component } from '@angular/core';
import { CsmsOrder } from '../../../../models/order/order.model';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../commons/consts/date-format.const';

@Component({
  selector: 'app-invoice-detail-popup',
  templateUrl: './invoice-detail-popup.component.html'
})
export class InvoiceDetailPopupComponent extends DialogComponent<any, any> {

  public order: CsmsOrder;

  constructor(
    public dialogService: DialogService) {
    super(dialogService);
  }

  public getShippingFee() {
    let result = '';
    if (this.order.isFreeShipVoucher) {
      result = this.formatCurrency(0);
      result += ' (-' + this.formatCurrency(this.order.shippingFee) + ')';
    } else {
      result = this.formatCurrency(this.order.shippingFee);
    }

    return result;
  }

  public getUsedVoucher() {
    if (this.order.voucherId) {
      if (this.order.isFreeShipVoucher) {
        return 'FREE SHIP (-100%)' + (this.order.voucherCode ? (' - ' + this.order.voucherCode) : '');
      }

      if (!this.order.isFreeShipVoucher && this.order.discountPercent) {
        return 'DISCOUNT (-' + this.order.discountPercent + '%)' + (this.order.voucherCode ? (' - ' + this.order.voucherCode) : '');
      }
    }

    return 'N/A';
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public parseDateTimeToString(date: string | Date): string {
    return date ? MomentHelper.formatDate(date, DateFormat.DateTimeFormatDDMMYYYYHHmm) : '';
  }
}
