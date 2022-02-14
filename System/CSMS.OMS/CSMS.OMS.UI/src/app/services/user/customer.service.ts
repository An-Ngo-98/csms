import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { CustomerList } from '../../models/customer/customer-list';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../models/app/paged-list.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly customerApiUrl = AppService.getPath(ApiController.UsersApi.Customer);

  constructor(private http: HttpClient) { }

  public getListCustomer(
    page: number, pageSize: number, sortField: number, sortType: number, statusSelected: string, searchString: string
  ): Observable<PagedListModel<CustomerList>> {
    return this.http.get(this.customerApiUrl + 'GetListCustomer/' + page + '/' + pageSize + '/' + sortField + '/' + sortType
      + '?customerStatus=' + statusSelected + '&searchString=' + encodeURIComponent(searchString))
      .pipe(
        map((res: PagedListModel<CustomerList>) => res)
      );
  }
}
