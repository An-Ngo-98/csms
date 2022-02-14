import { combineReducers } from 'redux';

import authReducer from './auth.reducer';
import cartReducer from './cart.reducer';
import userReducer from './user.reducer';
import systemReducer from './system.reducer';
import productReducer from './product.reducer';
import voucherReducer from './voucher.reducer';

const reducers = {
    authReducer,
    cartReducer,
    userReducer,
    systemReducer,
    productReducer,
    voucherReducer
};

const appReducer = combineReducers(reducers);

const rootReducer = (state, action) => {
    return appReducer(state, action);
}

export default rootReducer;