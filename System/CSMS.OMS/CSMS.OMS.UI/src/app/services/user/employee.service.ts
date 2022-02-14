import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { EmployeeList } from 'app/models/employee';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PagedListModel } from '../../models/app/paged-list.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employeeApiUrl = AppService.getPath(ApiController.UsersApi.Employee);
  // private readonly employeeApiUrl = 'http://localhost:50001/api/employee/';

  constructor(private http: HttpClient) { }

  public getListEmployee(
    page: number, pageSize: number, sortField: number, sortType: number,
    branchId: number, employeeStatus: string, searchBy: number, startDate: string, endDate: string, searchString: string
  ): Observable<PagedListModel<EmployeeList>> {
    return this.http.get(this.employeeApiUrl + 'GetListEmployee/' + page + '/' + pageSize + '/' + sortField + '/' + sortType
      + '?branchId=' + branchId + '&employeeStatus=' + employeeStatus + '&searchBy=' + searchBy
      + '&startDate=' + startDate + '&endDate=' + endDate + '&searchString=' + encodeURIComponent(searchString))
      .pipe(
        map((res: PagedListModel<EmployeeList>) => res)
      );
  }
}
