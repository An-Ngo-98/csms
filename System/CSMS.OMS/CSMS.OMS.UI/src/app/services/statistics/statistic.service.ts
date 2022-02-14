import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StatisticViewModel } from '../../models/admin-space/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private readonly userStatisticApiUrl = AppService.getPath(ApiController.UsersApi.Statistic);
  private readonly invoiceStatisticApiUrl = AppService.getPath(ApiController.InvoicesApi.Statistic);

  constructor(private http: HttpClient) { }

  public getNumOfNewUsers(startDate: string, endDate: string): Observable<number> {
    return this.http.get(this.userStatisticApiUrl + 'number-of-new-users' + '?startDate=' + startDate + '&endDate=' + endDate)
      .pipe(
        map((res: number) => res)
      );
  }

  public getStatisticData(startDate: string, endDate: string): Observable<StatisticViewModel> {
    return this.http.get(this.invoiceStatisticApiUrl + '?startDate=' + startDate + '&endDate=' + endDate)
      .pipe(
        map((res: StatisticViewModel) => res)
      );
  }
}
