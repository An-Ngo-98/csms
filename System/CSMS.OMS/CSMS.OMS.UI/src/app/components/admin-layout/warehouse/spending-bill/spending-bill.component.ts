import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { BillService } from '../../../../services/warehouse/bill.service';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { BillViewModel } from '../../../../models/warehouse/bill.model';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { DialogService } from 'angularx-bootstrap-modal';
import { PopupConfirmComponent } from '../../../commons/popup-confirm/popup-confirm.component';
import { NotificationService } from '../../../../services/notification.service';
import { Message } from '../../../../commons/consts/message.const';

@Component({
  selector: 'app-spending-bill',
  templateUrl: './spending-bill.component.html'
})
export class SpendingBillComponent implements OnInit {

  public loading = false;
  private now: Date = new Date(Date.now());
  public month = this.now.getMonth() + 1;
  public year = this.now.getFullYear();
  public listMonth: DropDownData[] = [];
  public listYear: DropDownData[] = [];

  public bills: BillViewModel[];

  constructor(private billService: BillService,
    private notificationService: NotificationService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {

    this.listMonth.push(
      new DropDownData(1, 1), new DropDownData(2, 2), new DropDownData(3, 3), new DropDownData(4, 4),
      new DropDownData(5, 5), new DropDownData(6, 6), new DropDownData(7, 7), new DropDownData(8, 8),
      new DropDownData(9, 9), new DropDownData(10, 10), new DropDownData(11, 11), new DropDownData(12, 12));

    this.listYear.push(
      new DropDownData(this.year, this.year),
      new DropDownData(this.year - 1, this.year - 1),
      new DropDownData(this.year - 2, this.year - 2),
      new DropDownData(this.year - 3, this.year - 3));

    this.getListBill();
  }

  public getListBill(): void {
    this.loading = true;
    this.billService.getListBill(+this.month, +this.year).subscribe(
      (bills) => {
        if (bills) {
          this.loading = false;
          this.bills = bills;
        }
      });
  }

  public onPaid(bill: BillViewModel, index: number): void {
    this.dialogService.addDialog(PopupConfirmComponent, {
      title: 'Payment',
      message: 'Are you sure want to pay for this bill?'
    }).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.billService.payBill(bill).subscribe(
          (res) => {
            this.getListBill();
            this.notificationService.success(Message.SaveSuccess);
          }, (err) => {
            this.loading = false;
            this.notificationService.error(Message.SaveFail);
          }
        )
      }
    });
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }
}
