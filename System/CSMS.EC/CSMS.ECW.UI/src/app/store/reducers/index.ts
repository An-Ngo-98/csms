import * as fromProduct from './product.reducer';
import * as fromCategory from './category.reducer';
import * as fromBranch from './branch.reducer';
import * as fromAuth from './auth.reducer';
import * as fromUser from './user.reducer';
import * as fromAddress from './address.reducer';
import * as fromLocation from './location.reducer';
import * as fromCart from './cart.reducer';
import * as fromVoucher from './voucher.reducer';
import * as FromOrder from './order.reducer';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'environments/environment';

export interface AppState {
    products: fromProduct.State;
    catogeries: fromCategory.State;
    branchs: fromBranch.State;
    auth: fromAuth.State;
    users: fromUser.State;
    addresses: fromAddress.State;
    locations: fromLocation.State;
    carts: fromCart.State;
    vouchers: fromVoucher.State;
    orders: FromOrder.State;
}

export const reducers: ActionReducerMap<AppState> = {
    products: fromProduct.reducer,
    catogeries: fromCategory.reducer,
    branchs: fromBranch.reducer,
    auth: fromAuth.reducer,
    users: fromUser.reducer,
    addresses: fromAddress.reducer,
    locations: fromLocation.reducer,
    carts: fromCart.reducer,
    vouchers: fromVoucher.reducer,
    orders: FromOrder.reducer,
}

export function clearState(reducer) {
    return function (state, action) {
        // if (action.type === AuthActionTypes.LogoutAction) {
        //   state = undefined;
        // }
        return reducer(state, action);
      };
}
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [clearState] : [];
