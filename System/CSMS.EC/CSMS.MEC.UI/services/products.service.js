import { getApiUrl } from "../configs/api.config";
import { ApiController } from "../commons/constants/api.controller";
import axios from 'axios';

const productUrl = getApiUrl(ApiController.ProductsApi.Product);
const reviewUrl = getApiUrl(ApiController.ProductsApi.Reviews);

const getEnableProducts = () => {
    const URL = productUrl + 'GetEnableProduct';
    return axios.get(URL);
}

const getProductReviews = (productId, page = 1, pageSize = 10, filterType = 0) => {
    const URL = reviewUrl + 'product-reviews/' + productId
        + '?page=' + page + '&pageSize=' + pageSize + '&filterType=' + filterType;
    return axios.get(URL);
}

const getUserReviews = (userId) => {
    const URL = reviewUrl + 'user-reviews/' + userId;
    return axios.get(URL);
}

const getUserReviewsByOrderId = (userId, orderId) => {
    const URL = reviewUrl + 'user-reviews/' + userId + '/' + orderId;
    return axios.get(URL);
}

const saveReview = (review) => {
    return axios.post(reviewUrl, review);
}

export const productService = {
    getEnableProducts,
    getProductReviews,
    getUserReviews,
    getUserReviewsByOrderId,
    saveReview
}