import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { RoleConstant, RoleIdConstant } from '../../commons/consts/permission.const';
import { UserRole } from '../../models/permission/user-permission.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly roleApiUrl = AppService.getPath(ApiController.UsersApi.Role);

  constructor(
    private http: HttpClient,
    private permissionsService: NgxPermissionsService) { }

  public getListRole() {
    return this.http.get(this.roleApiUrl + 'GetListRole')
      .pipe(
        map((res: UserRole[]) => res)
      );
  }

  public getListRoleForSelect() {
    return this.http.get(this.roleApiUrl + 'GetListRole')
      .pipe(
        map((res: UserRole[]) => res.filter((item) => item.roleId !== RoleIdConstant.Admin && item.roleId !== RoleIdConstant.Customer))
      );
  }

  public hasPermission(permission: string): boolean {
    const permissions = this.permissionsService.getPermissions();
    return permissions[permission] ? true : false;
  }
}
