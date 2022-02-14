import { cartConstants } from '../../commons/constants';

const addToCart = (product, units) => {
    product.units = units;

    return (dispatch) => {
        dispatch({ type: cartConstants.ADD_TO_CART, payload: product });
    }
}

const deleteProductInCart = (product) => {
    return (dispatch) => {
        dispatch({ type: cartConstants.DELETE_PRODUCT_IN_CART, payload: product });
    }
}

const clearCart = () => {
    return (dispatch) => {
        dispatch({ type: cartConstants.CLEAR_CART });
    }
}

export const cartActions = {
    addToCart,
    deleteProductInCart,
    clearCart
};