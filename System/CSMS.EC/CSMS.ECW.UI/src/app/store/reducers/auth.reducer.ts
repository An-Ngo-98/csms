import { User } from 'app/models/user.model';
import { AuthActionUnion, AuthActionTypes } from '../actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { load } from '@angular/core/src/render3';

export interface AuthLoading {
    loadingEntities?: boolean;
    createEntity?: boolean;
    updateEntity?: boolean;
    deleteEntity?: boolean;
    loginEntity?: boolean;
}
export interface State {
    users: User[];
    isLogged: boolean
    loading: AuthLoading
}
export const initialState: State =  {
    users: [],
    isLogged: false,
    loading: {}
}
export function reducer(state = initialState, action: AuthActionUnion): State {
    switch (action.type) {
        case AuthActionTypes.CreateUserAction: {
            return {
                ...state,
                loading: {...state.loading, createEntity: true}
            }
        }
        case AuthActionTypes.CreateUserSuccessAction: {
            return {
                ...state,
                users: [action.user],
                loading: {...state.loading, createEntity: false}
            };
        }
        case AuthActionTypes.CreateUserFailureAction: {
            return {
                ...state,
                loading: {...state.loading, createEntity: false}
            }
        }

        case AuthActionTypes.SignUpSocialAction: {
            return {
                ...state,
                loading: {...state.loading, createEntity: true}
            }
        }
        case AuthActionTypes.SignUpSocialSuccessAction: {
            return {
                ...state,
                users: [action.user],
                isLogged: true,
                loading: {...state.loading, createEntity: false}
            };
        }
        case AuthActionTypes.SignUpSocialFailureAction: {
            return {
                ...state,
                loading: {...state.loading, createEntity: false}
            }
        }

        case AuthActionTypes.LoginAction: {
            return {
                ...state,
                loading: {...state.loading, loginEntity: true}
            }
        }
        case AuthActionTypes.LoginSuccessAction: {
            return {
                ...state,
                users: [action.user],
                isLogged: true,
                loading: {...state.loading, loginEntity: false}
            }
        }
        case AuthActionTypes.LoginActionFailure: {
            return {
                ...state,
                loading: {...state.loading, loginEntity: false}
            }
        }
        case AuthActionTypes.ChangePasswordAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: true}
            }
        }
        case AuthActionTypes.ChangePasswordSuccessAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: false}
            }
        }
        case AuthActionTypes.ChangePasswordFailureAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: false}
            }
        }
        case AuthActionTypes.LogoutSuccessAction: {
            return {
                ...state,
                isLogged: false
            }
        }
        default:
            return state;
    }
}
export const getAuthFeatureState = createFeatureSelector<State>('auth');

export const authSelector = createSelector(
    getAuthFeatureState,
    (state: State) => state.users,
);

export const isLoggedSelector = createSelector(
    getAuthFeatureState,
    (state: State) => state.isLogged,
);
export const authLoadingSelector = createSelector(
    getAuthFeatureState,
    (state: State) => state.loading,
);
