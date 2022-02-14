import * as fromRoot from '../ngrx-store/reducers';
import * as userAction from '../ngrx-store/reducers/user/user.action';
import { CanActivate } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoginService } from '../services/user//login.service';
import { LsHelper } from '../commons/helpers/ls.helper';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { RouterService } from '../services/router.service';
import { Store } from '@ngrx/store';
import { UserLogin } from '../models/admin-space/user.model';
import { UserPermission, UserRole } from 'app/models/permission';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {

  constructor(
    private store: Store<fromRoot.State>,
    private loginService: LoginService,
    private routerService: RouterService,
    private permissionsService: NgxPermissionsService) { }

  public canActivate(): Observable<boolean> | boolean {
    return this.store.select(fromRoot.getCurrentUser).pipe(first(), map((user) => {

      if (user) {
        return true;
      }

      const storageUser: UserLogin = LsHelper.getUser() as UserLogin;
      const storagePermissions: UserPermission[] = LsHelper.getUserPermissions();
      const storageRoles: UserRole[] = LsHelper.getUserRoles();
      if (this.loginService.isUserValid(storageUser)) {
        this.store.dispatch(new userAction.CreateUser(storageUser));
        this.store.dispatch(new userAction.FetchUserPermissions(storagePermissions));
        this.store.dispatch(new userAction.FetchUserRoles(storageRoles));
        this.permissionsService.loadPermissions(storageRoles.map(item => item.roleName));
        this.permissionsService.addPermission(storagePermissions.map(item => item.permissionName));
        return true;
      } else {
        LsHelper.clearStorage();
        this.routerService.login();
        return false;
      }
    }));
  }
}
