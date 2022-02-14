import { ApiController } from '../../commons/consts/api-controller.const';
import { AppService } from '../../configs/app-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserPermission, UserRole } from 'app/models/permission';
import { UserViewModel, CsmsUserAddress } from '../../models/admin-space/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly userApiUrl = AppService.getPath(ApiController.UsersApi.User);
  // private readonly userApiUrl = 'http://localhost:50001/api/user/';
  private readonly userAvatarApiUrl = AppService.getPath(ApiController.CdnApi.UserAvatar);
  private readonly roleApiUrl = AppService.getPath(ApiController.UsersApi.Role);
  private readonly permissionApiUrl = AppService.getPath(ApiController.UsersApi.Permission);

  constructor(
    private http: HttpClient) { }

  public getUserInfo(userId: number) {
    return this.http.get(this.userApiUrl + 'GetUserInfoByUserId/' + userId)
      .pipe(
        map((res: UserViewModel) => res)
      );
  }

  public saveUserInfo(user: UserViewModel) {
    return this.http.post(this.userApiUrl + 'SaveUserInfo', user)
      .pipe(
        map((res: any) => res)
      );
  }

  public saveUserAddress(address: CsmsUserAddress) {
    return this.http.post(this.userApiUrl + 'SaveUserAddress', address)
      .pipe(
        map((res: any) => res)
      );
  }

  public deleteUserAddress(addressId: number) {
    return this.http.delete(this.userApiUrl + 'DeleteUserAddress/' + addressId)
      .pipe(
        map((res: any) => res)
      );
  }

  public updateUserAvatar(userId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    return this.http.post(this.userAvatarApiUrl + userId, formData)
      .pipe(
        map((res: any) => res)
      );
  }

  public deleteUser(userId: number) {
    return this.http.delete(this.userApiUrl + 'DeleteUserByUserId/' + userId)
      .pipe(
        map((res) => res)
      );
  }

  public getPermissions(userId: number) {
    return this.http.get(this.permissionApiUrl + 'GetPermissionsByUserId/' + userId)
      .pipe(
        map((res: UserPermission[]) => res)
      );
  }

  public getRoles(userId: number) {
    return this.http.get(this.roleApiUrl + 'GetRolesByUserId/' + userId)
      .pipe(
        map((res: UserRole[]) => res)
      );
  }
}
