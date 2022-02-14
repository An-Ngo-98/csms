import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import {
  RevenueOverviewViewModel,
  RevenueByStoreViewModel,
  RevenueByCategoryViewModel,
  BestSellingProductsViewModel,
  VoucherReportViewModel
} from '../../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly reportApiUrl = AppService.getPath(ApiController.InvoicesApi.Reports);

  constructor(private http: HttpClient) { }

  public getRevenueOverview(startTime: string, endTime: string): Observable<RevenueOverviewViewModel> {
    return this.http.get(this.reportApiUrl + 'revenue-overview' + '?startTime=' + startTime + '&endTime=' + endTime)
      .pipe(
        map((res: RevenueOverviewViewModel) => res)
      );
  }

  public getRevenueStore(startTime: string, endTime: string): Observable<RevenueByStoreViewModel> {
    return this.http.get(this.reportApiUrl + 'revenue-store' + '?startTime=' + startTime + '&endTime=' + endTime)
      .pipe(
        map((res: RevenueByStoreViewModel) => res)
      );
  }

  public getRevenueCategory(startTime: string, endTime: string): Observable<RevenueByCategoryViewModel> {
    return this.http.get(this.reportApiUrl + 'revenue-category' + '?startTime=' + startTime + '&endTime=' + endTime)
      .pipe(
        map((res: RevenueByCategoryViewModel) => res)
      );
  }

  public getBestSellingProducts(startTime: string, endTime: string): Observable<BestSellingProductsViewModel> {
    return this.http.get(this.reportApiUrl + 'best-selling-products' + '?startTime=' + startTime + '&endTime=' + endTime)
      .pipe(
        map((res: BestSellingProductsViewModel) => res)
      );
  }

  public getPromotionReports(voucherIds: string): Observable<VoucherReportViewModel[]> {
    return this.http.get(this.reportApiUrl + 'promotions' + '?voucherIds=' + voucherIds)
      .pipe(
        map((res: VoucherReportViewModel[]) => res)
      );
  }
}
