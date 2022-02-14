import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { OrderCart, OrderToOrder } from 'app/models/order.model';
import {
    Order,
    OrderActionTypes,
    OrderSuccess,
    OrderFailure,
    GetOrderByUserId,
    GetOrderByUserIdSuccess,
    GetOrderByUserIdFailure,
    GetOrderById,
    GetOrderByIdSuccess,
    GetOrderByIdFailure,
    CancelOrder,
    CancelOrderSuccess,
    CancelOrderFailure
} from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { OrderService } from 'app/services/cart/order.service';
import { Router } from '@angular/router';

@Injectable()
export class OrderEffects {
    @Effect() public order$: Observable<Action> = this.actions$.pipe(
        ofType<Order>(OrderActionTypes.OrderAction),
        switchMap(action =>
            this.orderService.order(action.orderToOrder).pipe(
                mergeMap((order: any) => {
                    localStorage.removeItem('cart');
                    localStorage.setItem('cart', JSON.stringify([]));
                    this.router.navigate(['order/details' + '/' + order.id]);
                    return [new OrderSuccess(order)];
                }),
                catchError(err => of(new OrderFailure())),
            ),
        ),
    );
    @Effect() public getOrderByUserId$: Observable<Action> = this.actions$.pipe(
        ofType<GetOrderByUserId>(OrderActionTypes.GetOrderByUserIdAction),
        switchMap(action =>
            this.orderService.getOrderByUserId(action.userId).pipe(
                mergeMap((order: OrderCart[]) => {
                    return [new GetOrderByUserIdSuccess(order)];
                }),
                catchError(err => of(new GetOrderByUserIdFailure())),
            ),
        ),
    );
    @Effect() public getOrderById$: Observable<Action> = this.actions$.pipe(
        ofType<GetOrderById>(OrderActionTypes.GetOrderByIdAction),
        switchMap(action =>
            this.orderService.getOrderById(action.orderId).pipe(
                mergeMap((order: OrderCart) => {
                    return [new GetOrderByIdSuccess(order)];
                }),
                catchError(err => of(new GetOrderByIdFailure())),
            ),
        ),
    );
    @Effect() public cancelOrder$: Observable<Action> = this.actions$.pipe(
        ofType<CancelOrder>(OrderActionTypes.CancelOrderAction),
        switchMap(action =>
            this.orderService.cancelOrder(action.orderId).pipe(
                mergeMap((order: OrderCart) => {
                    return [new CancelOrderSuccess(order)];
                }),
                catchError(err => of(new CancelOrderFailure())),
            ),
        ),
    );
    constructor(private actions$: Actions, private orderService: OrderService, private store: Store<AppState>, private router: Router) { }
}
