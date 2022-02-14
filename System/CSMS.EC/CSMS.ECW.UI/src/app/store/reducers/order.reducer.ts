import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VoucherActionUnion, VoucherActionTypes, OrderActionUnion, OrderActionTypes } from '../actions';
import { Voucher } from 'app/models/voucher.model';
import { OrderCart, OrderToOrder } from 'app/models/order.model';
import { load } from '@angular/core/src/render3';
export interface OrderLoading {
    loadingEntities?: boolean;
    orderEntity?: boolean;
    cancelEntity?: boolean;
}
export interface State {
    order: OrderToOrder[];
    orderOfUser: OrderCart[];
    orderDetail: OrderCart;
    orderCancel: OrderCart;
    loading: OrderLoading;
}
export const initialState: State =  {
    order: [],
    orderOfUser: [],
    orderCancel: undefined,
    orderDetail: undefined,
    loading: {}
}
export function reducer(state = initialState, action: OrderActionUnion): State {
    switch (action.type) {
        case OrderActionTypes.OrderAction: {
            return {
                ...state,
                loading: {...state.loading, orderEntity: true}
            };
        }
        case OrderActionTypes.OrderSuccessAction: {
            return {
                ...state,
                order: [action.order],
                loading: {...state.loading, orderEntity: false}
            };
        }
        case OrderActionTypes.OrderFailureAction: {
            return {
                ...state,
                loading: {...state.loading, orderEntity: false}
            };
        }
        case OrderActionTypes.GetOrderByUserIdAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case OrderActionTypes.GetOrderByUserIdSuccessAction: {
            return {
                ...state,
                orderOfUser: action.detailOrder,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case OrderActionTypes.GetOrderByUserIdFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case OrderActionTypes.GetOrderByIdAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case OrderActionTypes.GetOrderByIdSuccessAction: {
            return {
                ...state,
                orderDetail: action.order,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case OrderActionTypes.GetOrderByIdFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case OrderActionTypes.CancelOrderAction: {
            return {
                ...state,
                loading: {...state.loading, cancelEntity: true}
            }
        }
        case OrderActionTypes.CancelOrderSuccessAction: {
            return {
                ...state,
                orderCancel: action.order,
                loading: {...state.loading, cancelEntity: false}
            }
        }
        case OrderActionTypes.CancelOrderFailureAction: {
            return {
                ...state,
                loading: {...state.loading, cancelEntity: false}
            }
        }
        default:
            return state;
    }
}
export const getOrdersFeatureState = createFeatureSelector<State>('orders');

export const orderSelector = createSelector(
    getOrdersFeatureState,
    (state: State) => state.order,
);

export const getorderByUserIdSelector = createSelector(
    getOrdersFeatureState,
    (state: State) => state.orderOfUser,
);

export const cancelOrderSelector = createSelector(
    getOrdersFeatureState,
    (state: State) => state.orderCancel,
);

export const getOrderByIdSelector = createSelector(
    getOrdersFeatureState,
    (state: State) => state.orderDetail,
);

export const loadingOrderSelector = createSelector(
    getOrdersFeatureState,
    (state: State) => state.loading,
);
