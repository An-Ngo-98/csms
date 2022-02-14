import * as fromRoot from '../../../ngrx-store/reducers';
import * as userAction from '../../../ngrx-store/reducers/user/user.action';
import { Component, OnInit } from '@angular/core';
import { ErrorStatus } from '../../../commons/enums/error-status.enum';
import { Login } from '../../../models/login/login.model';
import { LoginService } from '../../../services/user//login.service';
import { LsHelper } from '../../../commons/helpers/ls.helper';
import { map } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { RouterService } from '../../../services/router.service';
import { SpinnerColor } from '../../../commons/consts/spinner.const';
import { Store } from '@ngrx/store';
import { UserLogin } from '../../../models/admin-space/user.model';
import { UserPermission, UserRole } from 'app/models/permission';
import { UserService } from '../../../services/user//user.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: Login;
  public error = false;
  public errorMessage = '';
  public loading = false;
  public spinnerColor = SpinnerColor.GrayLight;
  public images = ['bg-01.png', 'bg-02.png', 'bg-03.png', 'bg-04.png', 'bg-05.png'];
  public backgroundUrl = 'assets/img/backgrounds/';

  constructor(
    private store: Store<fromRoot.State>,
    private userService: UserService,
    private routerService: RouterService,
    private loginService: LoginService,
    private permissionsService: NgxPermissionsService) { }

  ngOnInit() {
    const random = Math.floor(Math.random() * 5);
    this.backgroundUrl += this.images[random];
    this.form = new Login();
  }

  public onSubmit() {
    this.loading = true;
    if (!this.checkValidate()) {
      this.loading = false;
      return;
    }

    this.loginService.login(this.form).subscribe((res) => {
      if (res && res.accessToken) {
        const user: UserLogin = this.loginService.parseUserFromToken(res.accessToken);
        zip(
          this.userService.getPermissions(user.id),
          this.userService.getRoles(user.id))
          .pipe(
            map(([permissions, roles]) => {
              if (permissions && roles) {
                this.store.dispatch(new userAction.UpdateUser(user));
                this.store.dispatch(new userAction.FetchUserRoles(roles as UserRole[]));
                this.store.dispatch(new userAction.FetchUserPermissions(permissions as UserPermission[]));
                LsHelper.save(LsHelper.UserStorage, user);
                LsHelper.save(LsHelper.UserRoleStorage, roles);
                LsHelper.save(LsHelper.UserPermissionStorage, permissions);
                this.permissionsService.loadPermissions(roles.map(item => item.roleName));
                this.permissionsService.addPermission(permissions.map(item => item.permissionName));
              } else {
                this.routerService.serverError();
              }
            })
          ).subscribe(() => {
            this.routerService.home();
          }, (err) => {
            this.error = true;
            this.loading = false;
            this.errorMessage = 'Server error. Please try again later.';
          });
      } else {
        this.error = true;
        this.loading = false;
        this.errorMessage = 'Wrong username or password';
      }
    }, (err) => {
      this.error = true;
      this.loading = false;
      this.errorMessage = err.error.message ? err.error.message : 'Server error. Please try again later.';
    });
  }

  private checkValidate(): boolean {
    if (!this.form.username || !this.form.password) {
      this.error = true;
      this.errorMessage = !this.form.username ? 'Username is required' : 'Password is required';
      this.errorMessage = !this.form.username && !this.form.password ? 'Username and password is required' : this.errorMessage;
      return false;
    }
    return true;
  }
}
