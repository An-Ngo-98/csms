import { UserLogin } from '../../../models/admin-space/user.model';
import { State } from './user.reducer';
import { UserPermission, UserRole } from 'app/models/permission';
import { PermissionConstant } from '../../../commons/consts/permission.const';

export const getCurrentUser: (state: State) => UserLogin = (state: State) => {
    return state ? state.user : undefined;
};

export const getUserPermissions: (state: State) => UserPermission[] = (state: State) => {
    return state ? state.userPermissions : undefined;
};

export const getUserRoles: (state: State) => UserRole[] = (state: State) => {
    return state ? state.userRoles : undefined;
};

export const isUserAdmin: (state: State) => boolean = (state: State) => {
    const permissionsNames: string[] = state.userPermissions.map((p) => p.permissionName);
    return permissionsNames.some((n) => n.includes('Admin'));
};

export const isSystemAdmin: (state: State) => boolean = (state: State) => {
    return state && state.userPermissions ?
        state.userPermissions.findIndex((x) => x.permissionName === PermissionConstant.Admin_System) > -1 :
        false;
};
