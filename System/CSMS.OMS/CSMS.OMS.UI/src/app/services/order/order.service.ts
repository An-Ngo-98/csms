import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TodayOrderViewModel } from '../../models/order';
import { OrderStatus } from '../../commons/enums/order-status.enum';
import { CsmsOrder } from '../../models/order/order.model';
import { PagedListModel } from '../../models/app/paged-list.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly orderApiUrl = AppService.getPath(ApiController.InvoicesApi.Orders);

  constructor(private http: HttpClient) { }

  public getTodayOrder(orderStatus: number, storeIds: string): Observable<TodayOrderViewModel> {
    return this.http.get(this.orderApiUrl + 'today-orders/' + orderStatus + '?storeIds=' + storeIds)
      .pipe(
        map((res: TodayOrderViewModel) => res)
      );
  }

  public getListOrder(page: number, pageSize: number, statusCode: string, voucherId: number = null,
    startTime: string, endTime: string, searchString: string, storeIds: string
  ): Observable<PagedListModel<CsmsOrder>> {
    return this.http.get(this.orderApiUrl + page + '/' + pageSize +
      '?statusCode=' + statusCode + '&voucherId=' + voucherId + '&startTime=' + startTime +
      '&endTime=' + endTime + '&searchString=' + searchString + '&storeIds=' + storeIds)
      .pipe(
        map((res: PagedListModel<CsmsOrder>) => res)
      );
  }

  public addNewOrder(order: CsmsOrder): Observable<CsmsOrder> {
    return this.http.post(this.orderApiUrl, order)
      .pipe(
        map((res: CsmsOrder) => res)
      );
  }

  public updateStatusOrder(orderId: string, orderStatus: number) {

    let statusUrl = '';
    switch (orderStatus) {
      case OrderStatus.Cooking:
        statusUrl = 'cook-time/';
        break;
      case OrderStatus.Shipping:
        statusUrl = 'ship-time/';
        break;
      case OrderStatus.Completed:
        statusUrl = 'completed-time/';
        break;
      case OrderStatus.Canceled:
        statusUrl = 'canceled-time/';
        break;
    }

    return this.http.put(this.orderApiUrl + statusUrl + orderId, null)
      .pipe(
        map((res: any) => res)
      );
  }

  public exportInvoices(selectedInvoiceIds: number[], exportType: number, searchCondition: string = '') {
    const listInvoiceIds: string = selectedInvoiceIds.join(',');

    return this.http.get(this.orderApiUrl + 'export-invoices/' + exportType
      + '?listInvoiceIds=' + listInvoiceIds + '&searchCondition=' + searchCondition, { responseType: 'blob' })
      .pipe(
        map((res: any) => res)
      );
  }
}
