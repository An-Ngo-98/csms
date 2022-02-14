import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import {AddProductToCart, CartActionTypes, AddProductToCartSuccess, AddProductToCartFailure, DeleteProductFromCart,
     DeleteProductFromCartSuccess, DeleteProductFromCartFailure, EditCountProductFromCart, EditCountProductFromCartSuccess,
     EditCountProductFromCartFailure } from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { CartService } from 'app/services/cart/cart.service';
import { Product } from 'app/models/product.model';
@Injectable()
export class CartEffects {
    @Effect() public addProductToCard$: Observable<Action> = this.actions$.pipe(
        ofType<AddProductToCart>(CartActionTypes.AddProductToCartAction),
        switchMap(action =>
            this.cartService.addProductToCart(action.product).pipe(
                mergeMap((product: Product) => {
                    return [new AddProductToCartSuccess(product)];
                }),
                catchError(err => of(new AddProductToCartFailure())),
            ),
        ),
    );

    @Effect() public deleteProductFromCart$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteProductFromCart>(CartActionTypes.DeleteProductFromCartAction),
        switchMap(action =>
            this.cartService.deleteProductFromCart(action.id).pipe(
                mergeMap((id: number) => [new DeleteProductFromCartSuccess(id)]),
                catchError(err => of(new DeleteProductFromCartFailure())),
            ),
        ),
    );

    @Effect() public editCountProductFromCart$: Observable<Action> = this.actions$.pipe(
        ofType<EditCountProductFromCart>(CartActionTypes.EditCountProductFromCartAction),
        switchMap(action =>
            this.cartService.editCountProductFromCart(action.product).pipe(
                mergeMap((product: Product) => [new EditCountProductFromCartSuccess(product)]),
                catchError(err => of(new EditCountProductFromCartFailure())),
            ),
        ),
    );
    constructor(private actions$: Actions, private cartService: CartService, private store: Store<AppState>) { }
}
