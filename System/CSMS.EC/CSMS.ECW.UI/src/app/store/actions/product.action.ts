import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { Product, ProductItem, ProductReview, ReviewProductToSave, ProductItemReview } from 'app/models/product.model';

export enum ProductActionTypes {
    LoadProductAction = '[Product] Load Product',
    LoadProductSuccessAction = '[Product] Load Product Success',
    LoadProductFailureAction = '[Product] Load Product Failure',

    SearchProductAction = '[Product] Search Product',
    SearchProductSuccessAction = '[Product] Search Product Success',
    SearchProductFailureAction = '[Product] Search Product Failure',

    LoveProductAction = '[Product] Love Product',
    LoveProductSuccessAction = '[Product] Love Product Success',
    LoveProductFailureAction = '[Product] Love Product Failure',

    DeleteLovedProductAction = '[Product] Delete Loved Product',
    DeleteLovedProductSuccessAction = '[Product] Delete Loved Product Success',
    DeleteLovedProductFailureAction = '[Product] Delete Loved Product Failure',

    BuyLaterProductAction = '[Product] Buy Later Product',
    BuyLaterProductSuccessAction = '[Product] Buy Later Product Success',
    BuyLaterProductFailureAction = '[Product] Buy Later Product Failure',

    DeleteBuyLaterProductAction = '[Product] Delete Buy Later Product',
    DeleteBuyLaterProductSuccessAction = '[Product] Delete Buy Later Product Success',
    DeleteBuyLaterProductFailureAction = '[Product] Delete Buy Later Product Failure',

    GetProductByBranchIdAction = '[Product] Get Product By Branch Id',
    GetProductByBranchIdSuccessAction = '[Product] Get Product By Branch Id Success',
    GetProductByBranchIdFailureAction = '[Product] Get Product By Branch Id Failure',

    GetReviewProductAction = '[Product] Get Review Product',
    GetReviewProductSuccessAction = '[Product] Get Review Product Success',
    GetReviewProductFailureAction = '[Product] Get Review Product Failure',

    GetAllReviewProductAction = '[Product] Get All Review Product',
    GetAllReviewProductSuccessAction = '[Product] Get All Review Product Success',
    GetAllReviewProductFailureAction = '[Product] Get All Review Product Failure',

    SaveReviewProductAction = '[Product] Save Review Product',
    SaveReviewProductSuccessAction = '[Product] Save Review Product Success',
    SaveReviewProductFailureAction = '[Product] Save Review Product Failure',
}

export class LoadProduct implements Action {
    public readonly type = ProductActionTypes.LoadProductAction;
    constructor(public page: number, public pageSize: number, public sortField: number, public categorySelected: number,
        public enabled: boolean) {}
}
export class LoadProductSuccess implements Action {
    public readonly type = ProductActionTypes.LoadProductSuccessAction;
    constructor(public products: ProductItem) {}
}
export class LoadProductFailure implements ErrorAction {
    public readonly type = ProductActionTypes.LoadProductFailureAction;
    constructor() {}
}
export class SearchProduct implements Action {
    public readonly type = ProductActionTypes.SearchProductAction;
    constructor(public page: number, public pageSize: number, public sortField: number, public categorySelected: number,
        public enabled: boolean, public searchString: string) {}
}

export class SearchProductSuccess implements Action {
    public readonly type = ProductActionTypes.SearchProductSuccessAction;
    constructor(public products: ProductItem) {}
}
export class SearchProductFailure implements ErrorAction {
    public readonly type = ProductActionTypes.SearchProductFailureAction;
    constructor() {}
}

export class LoveProduct implements Action {
    public readonly type = ProductActionTypes.LoveProductAction;
    constructor(public product: Product) {}
}

export class LoveProductSuccess implements Action {
    public readonly type = ProductActionTypes.LoveProductSuccessAction;
    constructor(public product: Product) {}
}

export class LoveProductFailure implements ErrorAction {
    public readonly type = ProductActionTypes.LoveProductFailureAction;
    constructor() {}
}

export class DeleteLovedProduct implements Action {
    public readonly type = ProductActionTypes.DeleteLovedProductAction;
    constructor(public product: Product) {}
}

export class DeleteLovedProductSuccess implements Action {
    public readonly type = ProductActionTypes.DeleteLovedProductSuccessAction;
    constructor(public product: Product) {}
}

export class DeleteLovedProductFailure implements ErrorAction {
    public readonly type = ProductActionTypes.DeleteLovedProductFailureAction;
    constructor() {}
}

export class BuyLaterProduct implements Action {
    public readonly type = ProductActionTypes.BuyLaterProductAction;
    constructor(public product: Product) {}
}

export class BuyLaterProductSuccess implements Action {
    public readonly type = ProductActionTypes.BuyLaterProductSuccessAction;
    constructor(public product: Product) {}
}

export class BuyLaterProductFailure implements Action {
    public readonly type = ProductActionTypes.BuyLaterProductFailureAction;
    constructor() {}
}

export class DeleteProductBuyLater implements Action {
    public readonly type = ProductActionTypes.DeleteBuyLaterProductAction;
    constructor(public id: string) {}
}

export class DeleteProductBuyLaterSuccess implements Action {
    public readonly type = ProductActionTypes.DeleteBuyLaterProductSuccessAction;
    constructor(public id: number) {}
}

export class DeleteProductBuyLaterFailure implements Action {
    public readonly type = ProductActionTypes.DeleteBuyLaterProductFailureAction;
    constructor() {}
}

export class GetProductByBranchId implements Action {
    public readonly type = ProductActionTypes.GetProductByBranchIdAction;
    constructor(public id: number) {}
}

export class GetProductByBranchIdSuccess implements Action {
    public readonly type = ProductActionTypes.GetProductByBranchIdSuccessAction;
    constructor(public products: Product[]) {}
}

export class GetProductByBranchIdFailure implements ErrorAction {
    public readonly type = ProductActionTypes.GetProductByBranchIdFailureAction;
    constructor() {}
}

export class GetReviewProduct implements Action {
    public readonly type = ProductActionTypes.GetReviewProductAction;
    constructor (public productId: number, public page: number, public pageSize: number) {}
}

export class GetReviewProductSuccess implements Action {
    public readonly type = ProductActionTypes.GetReviewProductSuccessAction;
    constructor (public productReviews: ProductReview) {}
}

export class GetReviewProductFailure implements ErrorAction {
    public readonly type = ProductActionTypes.GetReviewProductFailureAction;
    constructor () {}
}

export class GetAllReviewProduct implements Action {
    public readonly type = ProductActionTypes.GetAllReviewProductAction;
    constructor (public productId: number) {}
}

export class GetAllReviewProductSuccess implements Action {
    public readonly type = ProductActionTypes.GetAllReviewProductSuccessAction;
    constructor (public productReviews: ProductReview) {}
}

export class GetAllReviewProductFailure implements ErrorAction {
    public readonly type = ProductActionTypes.GetAllReviewProductFailureAction;
    constructor () {}
}

export class SaveReviewProduct implements Action {
    public readonly type = ProductActionTypes.SaveReviewProductAction;
    constructor(public review: ReviewProductToSave) {}
}

export class SaveReviewProductSuccess implements Action {
    public readonly type = ProductActionTypes.SaveReviewProductSuccessAction;
    constructor(public review: ProductItemReview) {}
}

export class SaveReviewProductFailure implements Action {
    public readonly type = ProductActionTypes.SaveReviewProductFailureAction;
    constructor() {}
}
export type ProductActionUnion =
    | LoadProduct
    | LoadProductSuccess
    | LoadProductFailure
    | SearchProduct
    | SearchProductSuccess
    | SearchProductFailure
    | LoveProduct
    | LoveProductSuccess
    | LoveProductFailure
    | DeleteLovedProduct
    | DeleteLovedProductSuccess
    | DeleteLovedProductFailure
    | BuyLaterProduct
    | BuyLaterProductSuccess
    | BuyLaterProductFailure
    | DeleteProductBuyLater
    | DeleteProductBuyLaterSuccess
    | DeleteProductBuyLaterFailure
    | GetProductByBranchId
    | GetProductByBranchIdSuccess
    | GetProductByBranchIdFailure
    | GetReviewProduct
    | GetReviewProductSuccess
    | GetReviewProductFailure
    | SaveReviewProduct
    | SaveReviewProductFailure
    | SaveReviewProductSuccess
    | GetAllReviewProduct
    | GetAllReviewProductFailure
    | GetAllReviewProductSuccess;
