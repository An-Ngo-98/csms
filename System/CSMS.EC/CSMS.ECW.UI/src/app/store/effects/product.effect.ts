import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of, pipe, merge } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ProductService } from 'app/services/product/product.service';
import { AppState } from '../reducers';
import {
    LoadProduct, ProductActionTypes, LoadProductSuccess, LoadProductFailure,
    SearchProduct, SearchProductFailure, SearchProductSuccess, LoveProduct, LoveProductSuccess, LoveProductFailure,
    DeleteLovedProduct, DeleteLovedProductSuccess, DeleteLovedProductFailure, BuyLaterProduct, BuyLaterProductSuccess,
    BuyLaterProductFailure,
    DeleteProductBuyLater,
    DeleteProductBuyLaterSuccess,
    DeleteProductBuyLaterFailure,
    GetProductByBranchId,
    GetProductByBranchIdSuccess,
    GetProductByBranchIdFailure,
    GetReviewProduct,
    GetReviewProductSuccess,
    GetReviewProductFailure,
    SaveReviewProduct,
    SaveReviewProductSuccess,
    SaveReviewProductFailure,
    GetAllReviewProduct,
    GetAllReviewProductSuccess,
    GetAllReviewProductFailure
} from '../actions';
import { switchMap, mergeMap, catchError, map } from 'rxjs/operators';
import { Product, ProductItem, ProductReview, ProductItemReview } from 'app/models/product.model';
@Injectable()
export class ProductEffects {
    @Effect() public loadProducts$: Observable<Action> = this.actions$.pipe(
        ofType<LoadProduct>(ProductActionTypes.LoadProductAction),
        switchMap(action =>
            this.productService.loadProducts(
                action.page,
                action.pageSize,
                action.sortField,
                action.categorySelected,
                action.enabled,
            ).pipe(
                mergeMap((products: ProductItem) => [new LoadProductSuccess(products)]),
                catchError(err => of(new LoadProductFailure())),
            ),
        ),
    );

    @Effect() public getProductByBranchId$: Observable<Action> = this.actions$.pipe(
        ofType<GetProductByBranchId>(ProductActionTypes.GetProductByBranchIdAction),
        switchMap(action =>
            this.productService.getProductByBranchId(action.id).pipe(
                mergeMap((products: Product[]) => [new GetProductByBranchIdSuccess(products)]),
                catchError(err => of(new GetProductByBranchIdFailure())),
            ),
        ),
    );

    @Effect() public searchProduct$: Observable<Action> = this.actions$.pipe(
        ofType<SearchProduct>(ProductActionTypes.SearchProductAction),
        switchMap(action =>
            this.productService.searchProducts(
                action.page,
                action.pageSize,
                action.sortField,
                action.categorySelected,
                action.enabled,
                action.searchString
            ).pipe(
                mergeMap((products: ProductItem) => [new SearchProductSuccess(products)]),
                catchError(err => of(new SearchProductFailure())),
            ),
        ),
    );

    @Effect() public loveProduct$: Observable<Action> = this.actions$.pipe(
        ofType<LoveProduct>(ProductActionTypes.LoveProductAction),
        switchMap(action =>
            this.productService.loveProducts(action.product).pipe(
                mergeMap((product: Product) => {
                    return [new LoveProductSuccess(product)];
                }),
                catchError(err => of(new LoveProductFailure()))
            )
            )
    );

    @Effect() public deleteLoveProduct$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteLovedProduct>(ProductActionTypes.DeleteLovedProductAction),
        switchMap(action =>
            this.productService.deleteLoveProducts(action.product).pipe(
                mergeMap((product: Product) => {
                    return [new DeleteLovedProductSuccess(product)];
                }),
                catchError(err => of(new DeleteLovedProductFailure()))
            )
            )
    )

    @Effect() public buyLaterProduct$: Observable<Action> = this.actions$.pipe(
        ofType<BuyLaterProduct>(ProductActionTypes.BuyLaterProductAction),
        switchMap(action =>
            this.productService.buyLaterProduct(action.product).pipe(
                mergeMap((product: Product) => {
                    return [new BuyLaterProductSuccess(product)];
                }),
                catchError(err => of(new BuyLaterProductFailure()))
            )
            )
    )

    @Effect() public deleteBuyLaterProduct$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteProductBuyLater>(ProductActionTypes.DeleteBuyLaterProductAction),
        switchMap(action =>
            this.productService.deleteBuyLaterProduct(action.id).pipe(
                mergeMap((id: number) => {
                    return [new DeleteProductBuyLaterSuccess(id)];
                }),
                catchError(err => of(new DeleteProductBuyLaterFailure()))
            )
            )
    )

    @Effect() public getProductReview$: Observable<Action> = this.actions$.pipe(
        ofType<GetReviewProduct>(ProductActionTypes.GetReviewProductAction),
        switchMap(action =>
            this.productService.getReviewProduct(action.productId, action.page, action.pageSize).pipe(
                switchMap((productReviews: ProductReview) => {
                    return [new GetReviewProductSuccess(productReviews)];
                }),
                catchError(err => of(new GetReviewProductFailure()))
            )
            )
    )

    @Effect() public getAllProductReview$: Observable<Action> = this.actions$.pipe(
        ofType<GetAllReviewProduct>(ProductActionTypes.GetAllReviewProductAction),
        switchMap(action =>
            this.productService.getAllReviewProduct(action.productId).pipe(
                switchMap((productReviews: ProductReview) => {
                    return [new GetAllReviewProductSuccess(productReviews)];
                }),
                catchError(err => of(new GetAllReviewProductFailure()))
            )
            )
    )

    @Effect() public saveReviewProduct$: Observable<Action> = this.actions$.pipe(
        ofType<SaveReviewProduct>(ProductActionTypes.SaveReviewProductAction),
        switchMap(action =>
            this.productService.saveReviewProduct(action.review).pipe(
                mergeMap((review: ProductItemReview) => {
                    return [new SaveReviewProductSuccess(review)];
                }),
                catchError(err => of(new SaveReviewProductFailure()))
            )
            )
    )
    constructor(private actions$: Actions, private productService: ProductService, private store: Store<AppState>) { }
}
