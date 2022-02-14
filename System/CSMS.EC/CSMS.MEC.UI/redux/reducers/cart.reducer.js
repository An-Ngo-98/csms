import { cartConstants } from '../../commons/constants';

export default function cartReducer(state = [], action = {}) {

    switch (action.type) {
        case cartConstants.ADD_TO_CART: {
            const product = action.payload;
            const cart = state;

            const existingProductIndex = findProductIndex(cart, product.id);

            const updatedCart = existingProductIndex >= 0
                ? updateProductUnits(cart, product)
                : [...cart, product];

            return updatedCart;
        }

        case cartConstants.DELETE_PRODUCT_IN_CART: {
            const product = action.payload;
            const cart = state;

            const updatedCart = deleteProduct(cart, product);

            return updatedCart;
        }

        case cartConstants.CLEAR_CART: {
            let updatedCart = [...state];
            updatedCart = [];
            return updatedCart;
        }
    }

    return state;
}


const findProductIndex = (cart, productID) => {
    return cart.findIndex(p => p.id === productID);
};

const updateProductUnits = (cart, product) => {
    const productIndex = findProductIndex(cart, product.id);

    const updatedCart = [...cart];
    const existingProduct = updatedCart[productIndex];

    const updatedUnitsProduct = {
        ...existingProduct,
        units: existingProduct.units + product.units
    };

    updatedCart[productIndex] = updatedUnitsProduct;

    return updatedCart;
};

const deleteProduct = (cart, product) => {
    let updatedCart = [...cart];
    updatedCart = updatedCart.filter(item => item.id !== product.id)

    return updatedCart;
};