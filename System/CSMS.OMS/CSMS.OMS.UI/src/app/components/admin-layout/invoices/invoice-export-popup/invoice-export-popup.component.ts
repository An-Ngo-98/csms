import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { OrderService } from '../../../../services/order/order.service';
import { NotificationService } from '../../../../services/notification.service';
import { SpinnerColor, SpinnerType } from '../../../../commons/consts/spinner.const';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import * as moment from 'moment';
import { Message } from '../../../../commons/consts/message.const';

enum ExportInvoiceType {
  SelectedInvoices = 1,
  SearchResult = 2,
}

enum ExportInvoiceFile {
  InvoiceSelected = 'Employee_Selected_',
  InvoiceSearchResult = 'Employee_SearchResult_'
}

@Component({
  selector: 'app-invoice-export-popup',
  templateUrl: './invoice-export-popup.component.html'
})
export class InvoiceExportPopupComponent extends DialogComponent<any, any> implements OnInit {

  public isWaiting = false;
  public userType = 0;
  public ExportInvoiceType = ExportInvoiceType;
  public SpinnerType = SpinnerType;
  public SpinnerColor = SpinnerColor;

  public selectedTypeToExport: number;
  public selectedInvoiceIds: number[] = [];
  private searchCondition: any[] = [];

  constructor(
    public dialogService: DialogService,
    private orderService: OrderService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  ngOnInit(): void {
    if (this.selectedInvoiceIds.length === 0) {
      this.selectedTypeToExport = ExportInvoiceType.SearchResult;
    } else {
      this.selectedTypeToExport = ExportInvoiceType.SelectedInvoices;
    }
  }

  public onExport() {
    this.isWaiting = true;
    this.orderService.exportInvoices(
      this.selectedInvoiceIds,
      this.selectedTypeToExport,
      this.searchCondition.join(';')).subscribe((res) => {
        if (res) {
          this.isWaiting = false;
          const date: any = MomentHelper.formatDate(moment(), DateFormat.DateFormatCSharp);
          const data: any = res;
          const blob: any = new Blob([data], { type: data.type });
          const a: any = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          switch (this.selectedTypeToExport) {
            case ExportInvoiceType.SelectedInvoices:
              a.download = ExportInvoiceFile.InvoiceSelected + date + '.xlsx';
              break;
            case ExportInvoiceType.SearchResult:
              a.download = ExportInvoiceFile.InvoiceSearchResult + date + '.xlsx';
              break;
          }
          document.body.appendChild(a);
          a.click();
          a.remove();
          this.notificationService.success(Message.EXPORT_SUCCESS);
          setTimeout(() => {
            this.close();
          }, 1000);
        }
      }, (err) => {
        this.isWaiting = false;
        this.notificationService.error(Message.EXPORT_FAIL);
      });
  }

  public onChooseExportType(exportUserType: number) {
    this.selectedTypeToExport = exportUserType;
  }
}
