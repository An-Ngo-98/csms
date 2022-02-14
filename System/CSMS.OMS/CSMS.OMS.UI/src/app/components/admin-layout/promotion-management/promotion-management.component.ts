import { Component, OnInit } from '@angular/core';
import { CsmsEvent, EventViewModel } from '../../../models/promotion/event.model';
import { DateFormat } from '../../../commons/consts/date-format.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { DropDownData } from '../../commons/dropdown/dropdown.component';
import { EventService } from '../../../services/promotion/event.service';
import { Message } from '../../../commons/consts/message.const';
import { MomentHelper } from '../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../services/notification.service';
import { PagedListModel } from '../../../models/app/paged-list.model';
import { RouterService } from '../../../services/router.service';
import { PromotionPopupComponent } from './promotion-popup/promotion-popup.component';

enum SearchBy {
  Ongoing = 1,
  Finished = 2,
  WillGoing = 3,
  StartDate = 4,
  EndDate = 5
}

@Component({
  selector: 'app-promotion-management',
  templateUrl: './promotion-management.component.html'
})
export class PromotionManagementComponent implements OnInit {
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

  constructor(
    private eventService: EventService,
    private routeService: RouterService,
    private dialogService: DialogService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.initFilter();
    this.getListPromotion(1, this.pageSize);
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

  public getListPromotion(page = 1, pageSize = this.pageSize): void {
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
        this.loading = false;
      },
      (err) => {
        this.notificationService.error(this.Message.EventManagement.LOAD_EVENT_LIST_FAIL);
        this.loading = false;
      });
  }

  public onExport(): void { }

  public onAdd(): void {
    this.dialogService.addDialog(PromotionPopupComponent, {
      promotion: new CsmsEvent()
    }).subscribe(
      (res) => {
        if (res && res.id > 0) {
          this.listPromotion.totalCount++;
          if (this.listPromotion.pageIndex === 1) {
            this.listPromotion.items.unshift(res);
            if (this.listPromotion.items.length > 10) {
              this.listPromotion.items.pop();
            }
          }
        }
      }
    );
  }

  public onViewEvent(event: EventViewModel): void {
    this.routeService.eventDetail(event.id);
  }

  public getStatus(event: EventViewModel): string {
    const now = new Date(Date.now());
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    if (startDate > now) {
      return 'Will going';
    } else {
      if (startDate <= now && (!endDate || endDate >= now)) {
        return 'On going';
      } else {
        return 'Finished';
      }
    }
  }

  public parseDateToString(date: string): string {
    return MomentHelper.parseDateToString(date, 'N/A');
  }
}

