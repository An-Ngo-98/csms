import * as fromUser from './user';
import { ActionReducerMap, createSelector } from '@ngrx/store';

export interface State {
    user: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
    user: fromUser.reducer,
};

// STATES
export const getUserState = (state: State) => state.user;

// USER
export const getCurrentUser     =    createSelector(getUserState, fromUser.getCurrentUser);
export const isUserAdmin        =    createSelector(getUserState, fromUser.isUserAdmin);
export const isUserSystemAdmin  =    createSelector(getUserState, fromUser.isSystemAdmin);
export const getUserPermissions  =    createSelector(getUserState, fromUser.getUserPermissions);
export const getUserRoles       =    createSelector(getUserState, fromUser.getUserRoles);