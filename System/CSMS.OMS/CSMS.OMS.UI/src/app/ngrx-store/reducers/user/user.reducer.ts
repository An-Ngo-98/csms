import * as userAction from './user.action';
import { UserLogin } from '../../../models/admin-space/user.model';
import { UserRole, UserPermission } from 'app/models/permission';

export interface State {
    user: UserLogin;
    userPermissions: UserPermission[];
    userRoles: UserRole[];
}

export const initialState: State = {
    user: null,
    userPermissions: [],
    userRoles: []
};

export function reducer(state: State = initialState, action: userAction.Actions): State {
    switch (action.type) {
        case userAction.ActionTypes.CREATE:
            return Object.assign({}, state, { user: action.payload });

        case userAction.ActionTypes.LOGOUT:
            return Object.assign({}, state, { user: Object.assign({}, state.user, { isLoggedOut: true }) });

        case userAction.ActionTypes.UPDATE:
            return Object.assign({}, state, { user: action.payload });

        case userAction.ActionTypes.FETCH_USER_PERMISSIONS:
            if (!action.payload) { return state; }
            return Object.assign({}, state, {
                userPermissions: action.payload
            });

        case userAction.ActionTypes.FETCH_USER_ROLES:
            if (!action.payload) { return state; }
            return Object.assign({}, state, {
                userRoles: action.payload
            });

        default:
            return state;
    }
}
