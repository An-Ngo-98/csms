import { getApiUrl } from "../configs/api.config";
import { ApiController } from "../commons/constants/api.controller";
import axios from 'axios';

const categoryUrl = getApiUrl(ApiController.ProductsApi.Category);

const getEnableCategories = () => {
    const URL = categoryUrl + 'GetEnableCategory';
    return axios.get(URL);
}

export const categoryService = {
    getEnableCategories
}