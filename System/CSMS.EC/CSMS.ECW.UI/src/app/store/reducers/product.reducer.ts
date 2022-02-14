import { Product, ProductItem, ProductReview, ProductItemReview } from 'app/models/product.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductActionUnion, ProductActionTypes } from '../actions';

export interface ProductLoading {
    loadingEntities?: boolean;
    searchEntity?: boolean;
    loveEntity?: boolean;
    deleteEntity?: boolean;
    buyLaterEntity?: boolean;
    saveEntity?: boolean;
}
export interface State {
    product: ProductItem;
    loved: Product[];
    buyLater: Product[];
    review: ProductReview;
    allReview: ProductReview;
    loading: ProductLoading
}
export const initialState: State =  {
    product: undefined,
    loved: [],
    buyLater: [],
    review: undefined,
    allReview: undefined,
    loading: {}
}
export function reducer(state = initialState, action: ProductActionUnion): State {
    switch (action.type) {
        case ProductActionTypes.LoadProductAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.LoadProductSuccessAction: {
            return {
                ...state,
                product: action.products,
                loading: {...state.loading, loadingEntities: false}
            };
        }
        case ProductActionTypes.LoadProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.SearchProductAction: {
            return {
                ...state,
                loading: {...state.loading, searchEntity: true}
            };
        }
        case ProductActionTypes.SearchProductSuccessAction: {
            return {
                ...state,
                product: action.products,
                loading: {...state.loading, searchEntity: false}
            }
        }
        case ProductActionTypes.SearchProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, searchEntity: true}
            };
        }
        case ProductActionTypes.LoveProductAction: {
            return {
                ...state,
                loading: {...state.loading, loveEntity: true}
            };
        }
        case ProductActionTypes.LoveProductSuccessAction: {
            return {
                ...state,
                loved: [...state.loved, action.product],
                loading: {...state.loading, loveEntity: false}
            }
        }
        case ProductActionTypes.LoveProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loveEntity: true}
            };
        }
        case ProductActionTypes.DeleteLovedProductAction: {
            return {
                ...state,
                loading: {...state.loading, deleteEntity: true}
            };
        }
        case ProductActionTypes.DeleteLovedProductSuccessAction: {
            return {
                ...state,
                loved: state.loved.filter(item => item.id !== action.product.id),
                loading: {...state.loading, deleteEntity: false}
            }
        }
        case ProductActionTypes.DeleteLovedProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, deleteEntity: true}
            };
        }
        case ProductActionTypes.BuyLaterProductAction: {
            return {
                ...state,
                loading: {...state.loading, buyLaterEntity: true}
            };
        }
        case ProductActionTypes.BuyLaterProductSuccessAction: {
            return {
                ...state,
                buyLater: [...state.buyLater, action.product],
                loading: {...state.loading, buyLaterEntity: false}
            }
        }
        case ProductActionTypes.BuyLaterProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, buyLaterEntity: true}
            };
        }
        case ProductActionTypes.DeleteBuyLaterProductAction: {
            return {
                ...state,
                loading: {...state.loading, deleteEntity: true}
            };
        }
        case ProductActionTypes.DeleteBuyLaterProductSuccessAction: {
            return {
                ...state,
                buyLater: state.buyLater.filter(item => item.id !== action.id),
                loading: {...state.loading, deleteEntity: false}
            }
        }
        case ProductActionTypes.DeleteBuyLaterProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, deleteEntity: true}
            };
        }
        case ProductActionTypes.GetProductByBranchIdAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.GetProductByBranchIdSuccessAction: {
            const newProducts: ProductItem = {
                ...state.product,
                items: action.products
            }
            return {
                ...state,
                product: newProducts,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case ProductActionTypes.GetProductByBranchIdFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.GetReviewProductAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.GetReviewProductSuccessAction: {
            return {
                ...state,
                review: action.productReviews,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case ProductActionTypes.GetReviewProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.SaveReviewProductAction: {
            return {
                ...state,
                loading: {...state.loading, saveEntity: true}
            };
        }
        case ProductActionTypes.SaveReviewProductSuccessAction: {
            const newReview: ProductReview = {
                ...state.review,
                items: [...state.review.items, action.review]
            }
            return {
                ...state,
                review: newReview,
                loading: {...state.loading, saveEntity: false}
            }
        }
        case ProductActionTypes.SaveReviewProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, saveEntity: false}
            };
        }
        case ProductActionTypes.GetAllReviewProductAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        case ProductActionTypes.GetAllReviewProductSuccessAction: {
            return {
                ...state,
                allReview: action.productReviews,
                loading: {...state.loading, loadingEntities: false}
            }
        }
        case ProductActionTypes.GetAllReviewProductFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            };
        }
        default:
            return state;
    }
}
export const getProductsFeatureState = createFeatureSelector<State>('products');

export const productSelector = createSelector(
    getProductsFeatureState,
    (state: State) => state.product,
);

export const loveSelector = createSelector(
    getProductsFeatureState,
    (state: State) => state.loved,
);

export const buyLaterSelector = createSelector(
    getProductsFeatureState,
    (state: State) => state.buyLater,
);

export const getProductReviewsSelector = createSelector(
    getProductsFeatureState,
    (state: State) => state.review,
);

export const getAllProductReviewsSelector = createSelector(
    getProductsFeatureState,
    (state: State) => state.allReview,
);
export const productLoadingSelector = createSelector(
    getProductsFeatureState,
    (state: State) => state.loading,
);
