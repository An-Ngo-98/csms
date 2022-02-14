import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { User, UserToCreate, Socialusers } from 'app/models/user.model';

export enum AuthActionTypes {
    LoginAction = '[User] Login',
    LoginSuccessAction = '[User] Login Success',
    LoginActionFailure = '[User] Login Failure',

    CreateUserAction = '[User] Create User',
    CreateUserSuccessAction = '[User] Create User Sucess',
    CreateUserFailureAction = '[User] Create User Success',

    ChangePasswordAction = '[User] Change Password',
    ChangePasswordSuccessAction = '[User] Change Password Success',
    ChangePasswordFailureAction = '[User] Change Password Failure',

    LogoutAction = '[Auth] Logout',
    LogoutSuccessAction = '[Auth] Logout Success',
    LogoutFailureAction = '[Auth] Logout Failure',

    SignUpSocialAction = '[User] SignUpSocial',
    SignUpSocialSuccessAction = '[User] SignUpSocial Success',
    SignUpSocialFailureAction = '[User] SignUpSocial Failure',
}

export class Login implements Action {
    public readonly type = AuthActionTypes.LoginAction;
    constructor(public username: string, public password: string) {}
}

export class LoginSuccess implements Action {
    public readonly type = AuthActionTypes.LoginSuccessAction;
    constructor(public user: User) {}
}

export class LoginFailure implements Action {
    public readonly type = AuthActionTypes.LoginActionFailure;
    constructor() {}
}

export class CreateUser implements Action {
    public readonly type = AuthActionTypes.CreateUserAction;
    constructor(public userToCreate: UserToCreate) {}
}

export class CreateUserSuccess implements Action {
    public readonly type = AuthActionTypes.CreateUserSuccessAction;
    constructor(public user: User) {}
}

export class CreateUserFailure implements ErrorAction {
    public readonly type = AuthActionTypes.CreateUserFailureAction;
    constructor() {}
}

export class SignUpSocial implements Action {
    public readonly type = AuthActionTypes.SignUpSocialAction;
    constructor(public userToCreate: Socialusers) {}
}

export class SignUpSocialSuccess implements Action {
    public readonly type = AuthActionTypes.SignUpSocialSuccessAction;
    constructor(public user: User) {}
}

export class SignUpSocialFailure implements ErrorAction {
    public readonly type = AuthActionTypes.SignUpSocialFailureAction;
    constructor() {}
}

export class ChangePassword implements Action {
    public readonly type = AuthActionTypes.ChangePasswordAction;
    constructor(public userId: string, public oldPassword: string, public newPassword: string) {}
}

export class ChangePasswordSuccess implements Action {
    public readonly type = AuthActionTypes.ChangePasswordSuccessAction;
    constructor() {}
}

export class ChangePasswordFailure implements ErrorAction {
    public readonly type = AuthActionTypes.ChangePasswordFailureAction;
    constructor() {}
}

export class Logout implements Action {
    public readonly type = AuthActionTypes.LogoutAction;
    constructor() {}
  }
  export class LogoutSuccess implements Action {
    public readonly type = AuthActionTypes.LogoutSuccessAction;
    constructor() {}
  }
  export class LogoutFailure implements Action {
    public readonly type = AuthActionTypes.LogoutFailureAction;
    constructor() {}
  }


export type AuthActionUnion =
    | CreateUser
    | CreateUserSuccess
    | CreateUserFailure
    | Login
    | LoginSuccess
    | LoginFailure
    | ChangePassword
    | ChangePasswordSuccess
    | ChangePasswordFailure
    | Logout
    | LogoutSuccess
    | LogoutFailure
    | SignUpSocial
    | SignUpSocialSuccess
    | SignUpSocialFailure;
