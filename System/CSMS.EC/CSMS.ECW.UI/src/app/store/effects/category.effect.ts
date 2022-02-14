import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import {LoadCategory, CategoryActionTypes, LoadCategorySuccess, LoadCategoryFailure } from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { CategoryService } from 'app/services/product/category.service';
import { Category, CategoryItem } from 'app/models/category.model';
@Injectable()
export class CategoryEffects {
    @Effect() public loadCategories$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCategory>(CategoryActionTypes.LoadCategoryAction),
        switchMap(action =>
            this.categoryService.loadCategories().pipe(
                mergeMap((categories: CategoryItem) => [new LoadCategorySuccess(categories)]),
                catchError(err => of(new LoadCategoryFailure())),
            ),
        ),
    );
    constructor(private actions$: Actions, private categoryService: CategoryService, private store: Store<AppState>) { }
}
