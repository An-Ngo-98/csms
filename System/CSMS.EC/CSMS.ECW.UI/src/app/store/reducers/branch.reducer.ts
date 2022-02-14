import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryActionUnion, CategoryActionTypes, BranchActionUnion, BranchActionTypes } from '../actions';
import { Category } from 'app/models/category.model';
import { Branch, BranchItem } from 'app/models/branch.models';
export interface BranchLoading {
    loadingEntities?: boolean;
    createEntity?: boolean;
    updateEntity?: boolean;
    deleteEntity?: boolean;
}
export interface State {
    branchs: BranchItem;
    branchsEnable: Branch[];
    loading: BranchLoading
}
export const initialState: State =  {
    branchs: undefined,
    branchsEnable: [],
    loading: {}
}
export function reducer(state = initialState, action: BranchActionUnion): State {
    switch (action.type) {
        case BranchActionTypes.LoadBranchAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case BranchActionTypes.LoadBranchSuccessAction: {
            return {
                ...state,
                branchs: action.branchs,
                loading: {...state.loading, loadingEntities: false}
            };
        }
        case BranchActionTypes.LoadBranchFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case BranchActionTypes.LoadBranchEnableAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case BranchActionTypes.LoadBranchEnableSuccessAction: {
            return {
                ...state,
                branchsEnable: action.branchs,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case BranchActionTypes.LoadBranchEnableFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        default:
            return state;
    }
}
export const getBranchsFeatureState = createFeatureSelector<State>('branchs');

export const branchSelector = createSelector(
    getBranchsFeatureState,
    (state: State) => state.branchs,
);

export const branchEnableSelector = createSelector(
    getBranchsFeatureState,
    (state: State) => state.branchsEnable,
);
export const branchLoadingSelector = createSelector(
    getBranchsFeatureState,
    (state: State) => state.loading,
);
