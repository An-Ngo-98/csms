import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserActionUnion, UserActionTypes } from '../actions';
import { User, UserReview, UserItemReview } from 'app/models/user.model';
export interface UserLoading {
    loadingEntities?: boolean;
    createEntity?: boolean;
    updateEntity?: boolean;
    deleteEntity?: boolean;
}
export interface State {
    user: User;
    loading: UserLoading;
    review: UserItemReview[]
}
export const initialState: State =  {
    user: undefined,
    loading: {},
    review: []
}
export function reducer(state = initialState, action: UserActionUnion): State {
    switch (action.type) {
        case UserActionTypes.GetInfoFromTokenAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case UserActionTypes.GetInfoFromTokenSuccessAction: {
            return {
                ...state,
                user: action.user,
                loading: {...state.loading, loadingEntities: false}
            };
        }
        case UserActionTypes.GetInfoFromTokenFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case UserActionTypes.UpdateProfileAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: true}
            };
        }
        case UserActionTypes.UpdateProfileSuccessAction: {
            return {
                ...state,
                user: action.user.data,
                loading: {...state.loading, updateEntity: false}
            }
        }
        case UserActionTypes.UpdateProfileFailureAction: {
            return {
                ...state,
                loading: {...state.loading, updateEntity: false}
            };
        }
        case UserActionTypes.GetReviewByUserIdAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case UserActionTypes.GetReviewByUserIdSuccessAction: {
            return {
                ...state,
                review: action.userReview,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case UserActionTypes.GetReviewByUserIdFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        default:
            return state;
    }
}
export const getUsersFeatureState = createFeatureSelector<State>('users');

export const userSelector = createSelector(
    getUsersFeatureState,
    (state: State) => state.user,
);
export const userReviewSelector = createSelector(
    getUsersFeatureState,
    (state: State) => state.review,
);
export const userLoadingSelector = createSelector(
    getUsersFeatureState,
    (state: State) => state.loading,
);
