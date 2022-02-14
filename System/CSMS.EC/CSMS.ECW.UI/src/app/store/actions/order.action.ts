import { Action } from '@ngrx/store';
import { OrderToOrder, OrderCart } from 'app/models/order.model';
import { ErrorAction } from 'app/models/error-action.class';

export enum OrderActionTypes {
    OrderAction = '[Order] Order',
    OrderSuccessAction = '[Order] Oder Success',
    OrderFailureAction = '[Order] Oder Failure',

    GetOrderByUserIdAction = '[Order] Get Order By User Id',
    GetOrderByUserIdSuccessAction = '[Order] Get Order By User Id Success',
    GetOrderByUserIdFailureAction = '[Order] Get Order By User Id Failure',

    GetOrderByIdAction = '[Order] Get Order By Id',
    GetOrderByIdSuccessAction = '[Order] Get Order By Id Success',
    GetOrderByIdFailureAction = '[Order] Get Order By Id Failure',

    CancelOrderAction = '[Order] Cancel Order',
    CancelOrderSuccessAction = '[Order] Cancel Order Success',
    CancelOrderFailureAction = '[Order] Cancel Order Failure',
}

export class Order implements Action {
    public readonly type = OrderActionTypes.OrderAction;
    constructor(public orderToOrder: OrderToOrder) {}
}

export class OrderSuccess implements Action {
    public readonly type = OrderActionTypes.OrderSuccessAction;
    constructor(public order: OrderToOrder) {}
}

export class OrderFailure implements Action {
    public readonly type = OrderActionTypes.OrderFailureAction;
    constructor() {}
}

export class GetOrderByUserId implements Action {
    public readonly type = OrderActionTypes.GetOrderByUserIdAction;
    constructor(public userId: string) {}
}

export class GetOrderByUserIdSuccess implements Action {
    public readonly type = OrderActionTypes.GetOrderByUserIdSuccessAction;
    constructor(public detailOrder: OrderCart[]) {}
}

export class GetOrderByUserIdFailure implements ErrorAction {
    public readonly type = OrderActionTypes.GetOrderByUserIdFailureAction;
    constructor() {}
}

export class GetOrderById implements Action {
    public readonly type = OrderActionTypes.GetOrderByIdAction;
    constructor(public orderId: string) {}
}

export class GetOrderByIdSuccess implements Action {
    public readonly type = OrderActionTypes.GetOrderByIdSuccessAction;
    constructor(public order: OrderCart) {}
}

export class GetOrderByIdFailure implements Action {
    public readonly type = OrderActionTypes.GetOrderByIdFailureAction;
    constructor() {}
}

export class CancelOrder implements Action {
    public readonly type = OrderActionTypes.CancelOrderAction;
    constructor(public orderId: string) {}
}

export class CancelOrderSuccess implements Action {
    public readonly type = OrderActionTypes.CancelOrderSuccessAction;
    constructor(public order: OrderCart) {}
}

export class CancelOrderFailure implements Action {
    public readonly type = OrderActionTypes.CancelOrderFailureAction;
    constructor() {}
}
export type OrderActionUnion =
    | Order
    | OrderSuccess
    | OrderFailure
    | GetOrderByUserId
    | GetOrderByUserIdSuccess
    | GetOrderByUserIdFailure
    | GetOrderById
    | GetOrderByIdSuccess
    | GetOrderByIdFailure
    | CancelOrder
    | CancelOrderSuccess
    | CancelOrderFailure;
