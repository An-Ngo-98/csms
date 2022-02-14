import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { CsmsDevice, CsmsEvent, CsmsEventType, EventViewModel } from '../../models/promotion/event.model';
import { DateFormat } from '../../commons/consts/date-format.const';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MomentHelper } from '../../commons/helpers/moment.helper';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../models/app/paged-list.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private readonly eventApiUrl = AppService.getPath(ApiController.PromotionsApi.Vouchers);

  constructor(private http: HttpClient) { }

  public getListEvent(page: number, pageSize: number, searchBy: string, startDate: string, endDate: string, searchString: string
  ): Observable<PagedListModel<EventViewModel>> {
    return this.http.get(this.eventApiUrl + page + '/' + pageSize
      + '?searchBy=' + searchBy + '&startDate=' + startDate
      + '&endDate=' + endDate + '&searchString=' + encodeURIComponent(searchString))
      .pipe(
        map((res: PagedListModel<EventViewModel>) => res)
      );
  }

  public getEventById(eventId: number): Observable<CsmsEvent> {
    return this.http.get(this.eventApiUrl + eventId)
      .pipe(
        map((res: CsmsEvent) => res)
      );
  }

  public saveEvent(event: CsmsEvent): Observable<CsmsEvent> {
    if (typeof event.startTime !== 'string') {
      event.startTime = MomentHelper.formatDate(event.startTime, DateFormat.DateTimeFormatJson);
    }
    if (event.endTime && typeof event.endTime !== 'string') {
      event.endTime = MomentHelper.formatDate(event.endTime, DateFormat.DateTimeFormatJson);
    }

    return this.http.post(this.eventApiUrl, event)
      .pipe(
        map((res: CsmsEvent) => res)
      );
  }

  public getDevices(): Observable<CsmsDevice[]> {
    return this.http.get(this.eventApiUrl + 'devices')
      .pipe(
        map((res: CsmsDevice[]) => res)
      );
  }
  public getCodeTypes(): Observable<CsmsDevice[]> {
    return this.http.get(this.eventApiUrl + 'event-types')
      .pipe(
        map((res: CsmsEventType[]) => res)
      );
  }
}
