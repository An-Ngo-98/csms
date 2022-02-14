import { Action } from '@ngrx/store';
import { UserLogin } from '../../../models/admin-space/user.model';
import { UserPermission, UserRole } from 'app/models/permission';

export const ActionTypes = {
    CREATE: '[User] Create User',
    UPDATE: '[User] Update User',
    LOGOUT: '[User] LogOut User',
    FETCH_USER_PERMISSIONS: '[User] Fetch user permissions',
    FETCH_USER_ROLES: '[User] Fetch user roles'
};

export class CreateUser implements Action {
    public readonly type: string = ActionTypes.CREATE;
    constructor(public payload: UserLogin) { }
}

export class UpdateUser implements Action {
    public readonly type: string = ActionTypes.UPDATE;
    constructor(public payload: UserLogin) { }
}

export class Logout implements Action {
    public readonly type: string = ActionTypes.LOGOUT;
    constructor(public payload: any) { }
}

export class FetchUserPermissions implements Action {
    public readonly type: string = ActionTypes.FETCH_USER_PERMISSIONS;
    constructor(public payload: UserPermission[]) { }
}

export class FetchUserRoles implements Action {
    public readonly type: string = ActionTypes.FETCH_USER_ROLES;
    constructor(public payload: UserRole[]) { }
}

export type Actions = CreateUser
    | UpdateUser
    | Logout
    | FetchUserPermissions
    | FetchUserRoles
