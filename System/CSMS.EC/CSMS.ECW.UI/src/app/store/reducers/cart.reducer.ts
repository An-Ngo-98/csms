import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartActionUnion, CartActionTypes } from '../actions';
import { Cart } from 'app/models/cart.mode';
import { Product } from 'app/models/product.model';

export interface State {
    cart: Product[];
}
export const initialState: State =  {
    cart: [],
}
export function reducer(state = initialState, action: CartActionUnion): State {
    switch (action.type) {
        case CartActionTypes.AddProductToCartSuccessAction: {
            let cart;
            const productIsExit = state.cart.find(item => item.id === action.product.id)
            if (productIsExit) {
               cart = state.cart.map(item => {
                    if (item.id !== action.product.id) { return item; }
                    return {
                        ...item,
                        count: item.count + action.product.count,
                    }
                })
            } else {
                cart = [...state.cart, action.product]
            }
            return {
                ...state,
                cart
            }
        }
        case CartActionTypes.DeleteProductFromCartSuccessAction: {
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.id)
            }
        }
        case CartActionTypes.EditCountProductFromCartSuccessAction: {
            const newCart = state.cart.map(item => {
                if (item.id !== action.product.id) { return item; }
                return {
                    ...item,
                    count: action.product.count,
                }
            })
            return {
                ...state,
                cart: newCart
            }
        }
        default:
            return state;
    }
}
export const getCartFeatureState = createFeatureSelector<State>('carts');

export const cartSelector = createSelector(
    getCartFeatureState,
    (state: State) => state.cart,
);
