import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { Category, CategoryItem } from 'app/models/category.model';

export enum CategoryActionTypes {
    LoadCategoryAction = '[Category] Load Category',
    LoadCategorySuccessAction = '[Category] Load Category Success',
    LoadCategoryFailureAction = '[Category] Load Category Failure',
}

export class LoadCategory implements Action {
    public readonly type = CategoryActionTypes.LoadCategoryAction;
    constructor() {}
}
export class LoadCategorySuccess implements Action {
    public readonly type = CategoryActionTypes.LoadCategorySuccessAction;
    constructor(public categories: CategoryItem) {}
}

export class LoadCategoryFailure implements ErrorAction {
    public readonly type = CategoryActionTypes.LoadCategoryFailureAction;
    constructor() {}
}

export type CategoryActionUnion =
    | LoadCategory
    | LoadCategorySuccess
    | LoadCategoryFailure;
