import { productConstants } from '../../commons/constants';
import { productService } from '../../services';

const getProducts = () => {
    return async (dispatch) => {
        dispatch(request());
        return productService.getEnableProducts()
            .then(res => {
                if (res.status === 200) {
                    dispatch(success(
                        res.data.sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
                    ));
                    return res;
                } else {
                    dispatch(failure(res.errors));
                    return res;
                }
            })
            .catch(error => {
                dispatch(failure(error));
                return error;
            });
    };
    function request() { return { type: productConstants.GET_PRODUCTS_LOADING } }
    function success(products) { return { type: productConstants.GET_PRODUCTS_SUCCESS, payload: products } }
    function failure(error) { return { type: productConstants.GET_PRODUCTS_FAILURE, payload: error } }
}

const addLovedProduct = (product) => {
    return (dispatch) => {
        dispatch({ type: productConstants.ADD_LOVED_PRODUCT, payload: product });
    }
}

const addViewedProduct = (product) => {
    return (dispatch) => {
        dispatch({ type: productConstants.ADD_VIEWED_PRODUCT, payload: product });
    }
}

const addBuyLateProduct = (product) => {
    return (dispatch) => {
        dispatch({ type: productConstants.ADD_BUY_LATE_PRODUCT, payload: product });
    }
}

const deleteLovedProduct = (product) => {
    return (dispatch) => {
        dispatch({ type: productConstants.DELETE_LOVED_PRODUCT, payload: product });
    }
}

const deleteViewedProduct = (product) => {
    return (dispatch) => {
        dispatch({ type: productConstants.DELETE_VIEWED_PRODUCT, payload: product });
    }
}

const deleteBuyLateProduct = (product) => {
    return (dispatch) => {
        dispatch({ type: productConstants.DELETE_BUY_LATE_PRODUCT, payload: product });
    }
}

export const productActions = {
    getProducts,
    addLovedProduct,
    addViewedProduct,
    addBuyLateProduct,
    deleteLovedProduct,
    deleteViewedProduct,
    deleteBuyLateProduct
};