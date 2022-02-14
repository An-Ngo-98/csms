import { getApiUrl } from "../configs/api.config";
import { ApiController } from "../commons/constants/api.controller";
import axios from 'axios';

const branchUrl = getApiUrl(ApiController.SystemApi.Branch);

const getEnableStores = () => {
    const URL = branchUrl + 'GetAllEnableBranch';
    return axios.get(URL);
}

const getEnableProvinces = () => {
    const URL = branchUrl + 'provinces';
    return axios.get(URL);
}

export const storeService = {
    getEnableStores,
    getEnableProvinces
}