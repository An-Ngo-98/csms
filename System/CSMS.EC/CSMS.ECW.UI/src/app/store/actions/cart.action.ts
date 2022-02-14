import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { Branch } from 'app/models/branch.models';
import { Product } from 'app/models/product.model';

export enum CartActionTypes {
    AddProductToCartAction = '[Cart] Add Product To Cart',
    AddProductToCartSuccessAction = '[Cart] Add Product To Cart Success',
    AddProductToCartFailureAction = '[Cart] Add Product To Cart Failure',

    ViewCartAction = '[Cart] View Cart',
    ViewCartSuccessAction = '[Cart] View Cart Success',
    ViewCartFailureAction = '[Cart] View Cart Failure',

    DeleteProductFromCartAction = '[Cart] Delete Product From Cart',
    DeleteProductFromCartSuccessAction = '[Cart] Delete Product From Cart Success',
    DeleteProductFromCartFailureAction = '[Cart] Delete Product From Cart Failure',

    EditCountProductFromCartAction = '[Cart] Edit Count Product From Cart',
    EditCountProductFromCartSuccessAction = '[Cart] Edit Count Product From Cart Success',
    EditCountProductFromCartFailureAction = '[Cart] Edit Count Product From Cart Failure',
}

export class AddProductToCart implements Action {
    public readonly type = CartActionTypes.AddProductToCartAction;
    constructor(public product: Product) {}
}

export class AddProductToCartSuccess implements Action {
    public readonly type = CartActionTypes.AddProductToCartSuccessAction;
    constructor(public product: Product) {}
}

export class AddProductToCartFailure implements Action {
    public readonly type = CartActionTypes.AddProductToCartFailureAction;
    constructor() {}
}

export class ViewCart implements Action {
    public readonly type = CartActionTypes.ViewCartAction;
    constructor() {}
}

export class ViewCartSuccess implements Action {
    public readonly type = CartActionTypes.ViewCartSuccessAction;
    constructor(public product: Product[]) {}
}

export class ViewCartFailure implements Action {
    public readonly type = CartActionTypes.ViewCartFailureAction;
    constructor() {}
}

export class DeleteProductFromCart implements Action {
    public readonly type = CartActionTypes.DeleteProductFromCartAction;
    constructor(public id: number) {}
}

export class DeleteProductFromCartSuccess implements Action {
    public readonly type = CartActionTypes.DeleteProductFromCartSuccessAction;
    constructor(public id: number) {}
}

export class DeleteProductFromCartFailure implements Action {
    public readonly type = CartActionTypes.DeleteProductFromCartFailureAction;
    constructor() {}
}

export class EditCountProductFromCart implements Action {
    public readonly type = CartActionTypes.EditCountProductFromCartAction;
    constructor(public product: Product) {}
}

export class EditCountProductFromCartSuccess implements Action {
    public readonly type = CartActionTypes.EditCountProductFromCartSuccessAction;
    constructor(public product: Product) {}
}

export class EditCountProductFromCartFailure implements Action {
    public readonly type = CartActionTypes.EditCountProductFromCartFailureAction;
    constructor() {}
}

export type CartActionUnion =
    | ViewCart
    | ViewCartSuccess
    | ViewCartFailure
    | AddProductToCart
    | AddProductToCartSuccess
    | AddProductToCartFailure
    | DeleteProductFromCart
    | DeleteProductFromCartSuccess
    | DeleteProductFromCartFailure
    | EditCountProductFromCart
    | EditCountProductFromCartSuccess
    | EditCountProductFromCartFailure;

