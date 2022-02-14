import { Injectable } from '@angular/core';
import { UserType, UserUrlExportFile } from '../../commons/enums/user.enum';
import { AppService } from '../../configs/app-service';
import { ApiController } from '../../commons/consts/api-controller.const';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private readonly employeeApiUrl = AppService.getPath(ApiController.UsersApi.Employee);
  private readonly customerApiUrl = AppService.getPath(ApiController.UsersApi.Customer);

  constructor(private http: HttpClient) { }

  public exportUsers(
    userType: number,
    userIds: number[],
    exportType: number,
    searchCondition: string = '') {

    const listUserId: string = userIds.join(',');
    let urlAddress = '';

    if (userType === UserType.Customer) {
      urlAddress = this.customerApiUrl + UserUrlExportFile.Customer;
    } else if (userType === UserType.Employee) {
      urlAddress = this.employeeApiUrl + UserUrlExportFile.Employee;
    }

    return this.http.get(urlAddress
      + exportType
      + '?listUserId=' + listUserId
      + '&searchCondition=' + searchCondition,
      { responseType: 'blob' })
      .pipe(
        map((res: any) => res)
      );
  }
}
