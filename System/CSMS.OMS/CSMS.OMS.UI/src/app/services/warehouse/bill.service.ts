import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { BillViewModel } from '../../models/warehouse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  private readonly billWarehouseApiUrl = AppService.getPath(ApiController.WarehouseApi.Bill);
  // private readonly billWarehouseApiUrl = 'http://localhost:50007/api/bills/';

  constructor(private http: HttpClient) { }

  public getListBill(month: number, year: number): Observable<BillViewModel[]> {
    return this.http.get(this.billWarehouseApiUrl + '?month=' + month + '&year=' + year)
      .pipe(map((res: BillViewModel[]) => res));
  }

  public payBill(bill: BillViewModel) {
    return this.http.post(this.billWarehouseApiUrl, bill)
      .pipe(map((res: any) => res));
  }
}
