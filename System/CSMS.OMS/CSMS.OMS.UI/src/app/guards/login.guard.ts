import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../services/user/login.service';
import { LsHelper } from '../commons/helpers/ls.helper';
import { Observable } from 'rxjs';
import { RouterService } from '../services/router.service';
import { UserLogin } from '../models/admin-space/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private routerService: RouterService) { }

  public canActivate(): Observable<boolean> | boolean {
    const storageUser: UserLogin = LsHelper.getUser() as UserLogin;
    if (this.loginService.isUserValid(storageUser)) {
      this.routerService.home();
      return false;
    } else {
      LsHelper.clearStorage();
      return true;
    }
  }
}
