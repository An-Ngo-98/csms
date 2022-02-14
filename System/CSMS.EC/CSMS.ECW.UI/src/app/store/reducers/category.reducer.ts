import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryActionUnion, CategoryActionTypes } from '../actions';
import { Category, CategoryItem } from 'app/models/category.model';
export interface CategoryLoading {
    loadingEntities?: boolean;
    createEntity?: boolean;
    updateEntity?: boolean;
    deleteEntity?: boolean;
}
export interface State {
    catogery: CategoryItem;
    loading: CategoryLoading;
}
export const initialState: State =  {
    catogery: undefined,
    loading: {}
}
export function reducer(state = initialState, action: CategoryActionUnion): State {
    switch (action.type) {
        case CategoryActionTypes.LoadCategoryAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case CategoryActionTypes.LoadCategorySuccessAction: {
            return {
                ...state,
                catogery: action.categories,
                loading: {...state.loading, loadingEntities: false}
            };
        }
        case CategoryActionTypes.LoadCategoryFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        default:
            return state;
    }
}
export const getCategoriesFeatureState = createFeatureSelector<State>('catogeries');

export const catogerySelector = createSelector(
    getCategoriesFeatureState,
    (state: State) => state.catogery,
);

export const catogeryLoadingSelector = createSelector(
    getCategoriesFeatureState,
    (state: State) => state.loading,
);
