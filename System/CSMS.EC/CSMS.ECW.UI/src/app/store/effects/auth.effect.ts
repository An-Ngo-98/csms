import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of, defer } from 'rxjs';
import { AuthServiceLocal } from 'app/services/auth/auth.service';
import { Store, Action } from '@ngrx/store';
import { AppState } from '..';
import { CreateUser, AuthActionTypes, CreateUserSuccess, CreateUserFailure, Login,
    LoginSuccess, LoginFailure, ChangePassword, ChangePasswordSuccess, ChangePasswordFailure, Logout,
     LogoutSuccess, LogoutFailure, SignUpSocial, SignUpSocialSuccess, SignUpSocialFailure } from '../actions';
import { switchMap, mergeMap, catchError, tap } from 'rxjs/operators';
import { User } from 'app/models/user.model';
import { LocalStorageService } from 'app/services/local-storage.service';
import { Route, Router } from '@angular/router';

@Injectable()
export class AuthEffects {
    @Effect() public createUser$: Observable<Action> = this.actions$.pipe(
        ofType<CreateUser>(AuthActionTypes.CreateUserAction),
        switchMap(action =>
            this.authService.createUser(action.userToCreate).pipe(
                mergeMap((user: User) => [new CreateUserSuccess(user)]),
                catchError(err => of(new CreateUserFailure())),
            ),
        ),
    );

    @Effect() public signUpSocial$: Observable<Action> = this.actions$.pipe(
        ofType<SignUpSocial>(AuthActionTypes.SignUpSocialAction),
        switchMap(action =>
            this.authService.signUpSocical(action.userToCreate).pipe(
                mergeMap((user: User) => {
                    return [new SignUpSocialSuccess(user)];
                }),
                catchError(err => of(new SignUpSocialFailure())),
            ),
        ),
    );

    @Effect() public login$: Observable<Action> = this.actions$.pipe(
        ofType<Login>(AuthActionTypes.LoginAction),
        switchMap(action =>
            this.authService.login(action.username, action.password).pipe(
                mergeMap((user: User) => {
                    console.log(user);
                    this._handleLogInSucess(user.accessToken, user)
                    return [new LoginSuccess(user)];
                }),
                catchError(err => of(new LoginFailure())),
            ),
        ),
    );

    @Effect() public logout$: Observable<Action> = this.actions$.pipe(
        ofType<Logout>(AuthActionTypes.LogoutAction),
        switchMap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/']);
          return [new LogoutSuccess()];
        }),
        catchError((err => of(new LogoutFailure()))),
      );

    @Effect()
    init$ = defer(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
         return of(new LoginSuccess(JSON.parse(userData)));
      } else {
        return <any> of(new Logout());
      }
    });

    @Effect() public changePassword$: Observable<Action> = this.actions$.pipe(
        ofType<ChangePassword>(AuthActionTypes.ChangePasswordAction),
        switchMap(action =>
            this.authService.changePassword(action.userId, action.oldPassword, action.newPassword).pipe(
                mergeMap(() => [new ChangePasswordSuccess()]),
                catchError(err => of(new ChangePasswordFailure())),
            ),
        ),
    );
    constructor(private actions$: Actions, private authService: AuthServiceLocal, private store: Store<AppState>,
        private localStorageService: LocalStorageService,
        private router: Router) { }
    private _handleLogInSucess(authToken: string, user: User) {
        this.localStorageService.setAuthToken(authToken);
        this.localStorageService.setUserObject(user);
    }
}
