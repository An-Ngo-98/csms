import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../../services/statistics/report.service';
import { VoucherReportViewModel } from '../../../../models/report';
import { EventViewModel } from '../../../../models/promotion/event.model';
import { PagedListModel } from '../../../../models/app/paged-list.model';
import { Message } from '../../../../commons/consts/message.const';
import { MomentHelper } from '../../../../commons/helpers/moment.helper';
import { DropDownData } from '../../../commons/dropdown/dropdown.component';
import { DateFormat } from '../../../../commons/consts/date-format.const';
import { EventService } from '../../../../services/promotion/event.service';
import { NotificationService } from '../../../../services/notification.service';

enum SearchBy {
  Ongoing = 1,
  Finished = 2,
  WillGoing = 3,
  StartDate = 4,
  EndDate = 5
}

@Component({
  selector: 'app-promotions-report',
  templateUrl: './promotions-report.component.html'
})
export class PromotionsReportComponent implements OnInit {
  public page = 1;
  public pageSize = 10;
  public listPageSize = [10, 20, 30, 50, 100];
  public loading = false;
  public Message = Message;
  public listPromotion: PagedListModel<EventViewModel>;
  public listSearchBy: DropDownData[] = [];
  public SearchBy = SearchBy;
  public startDate = MomentHelper.startDateOfMonth().format(DateFormat.DateFormatJson);
  public endDate = MomentHelper.endDateOfMonth().format(DateFormat.DateFormatJson);

  public searchBySelected = SearchBy.Ongoing.toString();
  public searchString = '';

  public listPromoteReport: VoucherReportViewModel[];

  constructor(
    private eventService: EventService,
    private reportService: ReportService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.initFilter();
    this.getData(1, this.pageSize);
  }

  private initFilter(): void {
    this.listSearchBy.push(
      new DropDownData('All', 'All'),
      new DropDownData(SearchBy.Ongoing.toString(), 'On going'),
      new DropDownData(SearchBy.Finished.toString(), 'Finished'),
      new DropDownData(SearchBy.WillGoing.toString(), 'Will going'),
      new DropDownData(SearchBy.StartDate.toString(), 'Start date'),
      new DropDownData(SearchBy.EndDate.toString(), 'End date')
    );
  }

  public getData(page = 1, pageSize = this.pageSize): void {
    this.loading = true;
    this.page = page;
    this.pageSize = pageSize;

    this.eventService.getListEvent(
      this.page,
      this.pageSize,
      this.searchBySelected,
      this.startDate ? MomentHelper.parseDateToString(this.startDate, null, DateFormat.DateFormatCSharp) : null,
      this.endDate ? MomentHelper.parseDateToString(this.endDate, null, DateFormat.DateFormatCSharp) : null,
      this.searchString
    ).subscribe(
      (res) => {
        this.listPromotion = res;
        const promotionIds = this.listPromotion.items.map(item => item.id);
        this.reportService.getPromotionReports(promotionIds.join(',')).subscribe(
          (resReport) => {
            if (res) {
              this.listPromoteReport = resReport;
              this.loading = false;
            }
          }
        );
      },
      (err) => {
        this.notificationService.error(this.Message.EventManagement.LOAD_EVENT_LIST_FAIL);
        this.loading = false;
      });
  }

  public parseDateToString(date: string): string {
    return MomentHelper.parseDateToString(date, 'N/A', DateFormat.DateTimeFormatDDMMYYYYHHmm);
  }

  public formatCurrency(numberInput: number): string {
    if (!numberInput && numberInput !== 0) {
      return 'N/A';
    }

    return numberInput.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }
}
