import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { ImportExportHistoryViewModel } from '../../../../../models/warehouse/material.model';
import { Message } from '../../../../../commons/consts/message.const';
import { NotificationService } from '../../../../../services/notification.service';
import { WarehouseService } from '../../../../../services/warehouse/warehouse.service';
import { MomentHelper } from '../../../../../commons/helpers/moment.helper';
import { DateFormat } from '../../../../../commons/consts/date-format.const';

@Component({
  selector: 'app-import-export-history-popup',
  templateUrl: './import-export-history-popup.component.html'
})
export class ImportExportHistoryPopupComponent extends DialogComponent<any, any> implements OnInit {

  public materialId: number = null;
  public histories: ImportExportHistoryViewModel[];

  constructor(
    public dialogService: DialogService,
    private warehouseService: WarehouseService,
    private notificationService: NotificationService) {
    super(dialogService);
  }

  ngOnInit(): void {
    this.warehouseService.getImportExportHistories(this.materialId).subscribe(
      (res) => {
        this.histories = res;
      }, (err) => {
        this.notificationService.error(Message.Error.SEVER_ERROR);
      }
    );
  }

  public formatTime(history: ImportExportHistoryViewModel): string {
    if (history) {
      return MomentHelper.formatDate(history.time, DateFormat.DateTimeFormatDDMMYYYYHHmm);
    }

    return 'N/A';
  }

  public getTitle(history: ImportExportHistoryViewModel): string {
    if (history) {
      if (history.isImport) {
        return 'Import ' + history.quantity + ' ' + history.unit + ' '
          + history.materialName + ' from ' + history.partnerName;
      } else {
        return 'Export ' + history.quantity + ' ' + history.unit + ' '
          + history.materialName + ' to ' + history.branchName;
      }
    }

    return 'N/A';
  }
}
