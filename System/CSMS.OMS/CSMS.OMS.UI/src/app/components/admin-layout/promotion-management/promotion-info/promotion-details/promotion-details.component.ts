import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CsmsEvent } from '../../../../../models/promotion';
import { DateFormat } from '../../../../../commons/consts/date-format.const';
import { DialogService } from 'angularx-bootstrap-modal';
import { EventService } from '../../../../../services/promotion/event.service';
import { Message } from '../../../../../commons/consts/message.const';
import { MomentHelper } from '../../../../../commons/helpers/moment.helper';
import { NotificationService } from '../../../../../services/notification.service';
import { RouterService } from '../../../../../services/router.service';
import { PromotionPopupComponent } from '../../promotion-popup/promotion-popup.component';

@Component({
  selector: 'app-promotion-details',
  templateUrl: './promotion-details.component.html'
})
export class PromotionDetailsComponent implements OnInit {

  public loading = false;

  private promotionId: number;
  public promotion: CsmsEvent = new CsmsEvent();

  constructor(
    public dialogService: DialogService,
    private eventService: EventService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private routerService: RouterService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.promotionId = params['id'];
        this.initData();
      } else {
        this.routerService.notFound();
      }
    });
  }

  private initData(): void {
    this.loading = true;
    this.eventService.getEventById(this.promotionId).subscribe(
      (res) => {
        this.promotion = res;
        this.loading = false;
      },
      () => {
        this.notificationService.error(Message.EventManagement.LOAD_EVENT_FAIL);
        this.loading = false;
      });
  }

  private saveEvent(): void {
    this.loading = true;
    this.eventService.saveEvent(this.promotion).subscribe(
      (res) => {
        if (res && res.id > 0) {
          this.loading = false;
          this.promotion = res;
          this.notificationService.success(Message.EventManagement.SAVE_EVENT_SUCCESS);
        }
      }, () => {
        this.loading = false;
        this.notificationService.error(Message.EventManagement.SAVE_EVENT_FAIL);
      });
  }

  public onChangeStatus(status: boolean): void {
    this.promotion.enabled = status;
    this.saveEvent();
  }

  public onStartNow(): void {
    this.promotion.startTime = new Date(Date.now());
    this.saveEvent();
  }

  public onStopNow(): void {
    this.promotion.endTime = new Date(Date.now());
    this.saveEvent();
  }

  public onEdit(): void {
    this.dialogService.addDialog(PromotionPopupComponent, {
      promotion: this.promotion
    }).subscribe(
      (res) => {
        if (res && res.id > 0) {
          this.promotion = res;
        }
      }
    );
  }

  public parseDateToString(date: string, outputWhenInvalid: string = 'N/A'): string {
    const value = MomentHelper.formatDate(date, DateFormat.FullDate);
    if (value === 'Invalid date') {
      return outputWhenInvalid;
    }

    return value;
  }

  public formatAppliedProducts(promotion: CsmsEvent): string {
    if (promotion.appliedAllProducts) {
      return 'All products';
    } else {
      let result = '';
      if (promotion.categoryIds.length > 0) {
        result += promotion.categoryIds.length;
        result += promotion.categoryIds.length === 1 ? ' category' : ' categories';
      }

      if (promotion.productIds.length > 0) {
        result += result.length === 0 ? '' : ' + ';
        result += promotion.productIds.length;
        result += promotion.productIds.length === 1 ? ' product' : ' products';
      }

      return result;
    }
  }

  public convertCurrency(price: number, outputWhenInvalid: string = 'N/A'): string {
    if (!price) {
      return outputWhenInvalid;
    }

    return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ₫';
  }

  public formatLimit(time: number, outputWhenInvalid: string = 'No limit'): string {
    if (!time) {
      return outputWhenInvalid;
    }

    return time + time < 2 ? ' time' : 'times';
  }

  public enableStartButton(): boolean {
    const now = new Date(Date.now());
    const startDate = new Date(this.promotion.startTime);

    return startDate > now;
  }

  public enableStopButton(): boolean {
    const now = new Date(Date.now());
    const startDate = new Date(this.promotion.startTime);
    const endDate = this.promotion.endTime ? new Date(this.promotion.endTime) : null;

    return startDate <= now && (!endDate || endDate >= now);
  }

  public getStatus(): string {
    const now = new Date(Date.now());
    const startDate = new Date(this.promotion.startTime);
    const endDate = this.promotion.endTime ? new Date(this.promotion.endTime) : null;

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
}
