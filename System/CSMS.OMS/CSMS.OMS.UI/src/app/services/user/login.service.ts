import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { AppService } from '../../configs/app-service';
import { map } from 'rxjs/operators';
import { LsHelper } from '../../commons/helpers/ls.helper';
import { Login } from '../../models/login/login.model';
import { UserLogin } from '../../models/admin-space/user.model';
import { ApiController } from '../../commons/consts/api-controller.const';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly apiUrl = AppService.getPath(ApiController.UsersApi.Account);

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) { }

  public login(loginForm: Login) {
    return this.http.post<any>(this.apiUrl + 'login', loginForm)
      .pipe(
        map((res) => res)
      );
  }

  public isUserValid(storageUser: UserLogin = LsHelper.getUser() as UserLogin): boolean {
    if (!storageUser || !storageUser.accessToken || storageUser.isLoggedOut || !storageUser.id || this.isTokenExpired()) {
      LsHelper.clearStorage();
      return false;
    }
    return true;
  }

  private isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired();
  }

  public parseUserFromToken(token: string): UserLogin {
    const user: UserLogin = new UserLogin();
    user.accessToken = token;

    try {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
      user.id = decodedToken.user_id;
      user.userName = decodedToken.user_name;
      user.userCode = decodedToken.user_code;
      user.firstName = decodedToken.first_name;
      user.lastName = decodedToken.last_name;
      user.middleName = decodedToken.middle_name;
      return user;
    } catch (err) {
      return user;
    }
  }
}
