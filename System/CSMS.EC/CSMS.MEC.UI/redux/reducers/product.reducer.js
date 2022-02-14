import { productConstants } from '../../commons/constants';
import { combineReducers } from 'redux';

const getProducts = (state = {}, action) => {
    switch (action.type) {
        case productConstants.GET_PRODUCTS_LOADING:
            return {
                isLoading: true,
                isError: false,
                isSuccess: false,
                errors: null,
                products: null
            }

        case productConstants.GET_PRODUCTS_SUCCESS:
            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                errors: null,
                products: action.payload
            }

        case productConstants.GET_PRODUCTS_FAILURE:
            return {
                isLoading: false,
                isError: true,
                isSuccess: false,
                errors: action.payload,
                products: null
            }

        default:
            return state
    }
}

const lovedProducts = (state = [], action = {}) => {

    switch (action.type) {
        case productConstants.ADD_LOVED_PRODUCT: {
            const product = action.payload;
            const products = state;
            const existingProductIndex = findProductIndex(products, product.id);

            const updatedProducts = existingProductIndex < 0 ?
                [...products, product] :
                products;

            return updatedProducts;
        }

        case productConstants.DELETE_LOVED_PRODUCT: {
            const product = action.payload;
            const products = state;
            const updatedProducts = deleteProduct(products, product);

            return updatedProducts;
        }
    }

    return state;
}

const viewedProducts = (state = [], action = {}) => {

    switch (action.type) {
        case productConstants.ADD_VIEWED_PRODUCT: {
            const product = action.payload;
            const products = state;

            let updatedProducts = deleteProduct(products, product);
            updatedProducts = [product, ...updatedProducts];

            return updatedProducts;
        }

        case productConstants.DELETE_VIEWED_PRODUCT: {
            const product = action.payload;
            const products = state;
            const updatedProducts = deleteProduct(products, product);

            return updatedProducts;
        }
    }

    return state;
}

const buyLateProducts = (state = [], action = {}) => {

    switch (action.type) {
        case productConstants.ADD_BUY_LATE_PRODUCT: {
            const product = action.payload;
            const products = state;

            let updatedProducts = deleteProduct(products, product);
            updatedProducts = [product, ...products];

            return updatedProducts;
        }

        case productConstants.DELETE_BUY_LATE_PRODUCT: {
            const product = action.payload;
            const products = state;
            const updatedProducts = deleteProduct(products, product);

            return updatedProducts;
        }
    }

    return state;
}

const findProductIndex = (products, productID) => {
    return products.findIndex(p => p.id === productID);
};

const deleteProduct = (products, product) => {
    let updatedProducts = [...products];
    updatedProducts = updatedProducts.filter(item => item.id !== product.id)

    return updatedProducts;
};

export default combineReducers({
    getProducts,
    lovedProducts,
    viewedProducts,
    buyLateProducts
});