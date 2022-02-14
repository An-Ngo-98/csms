import { getApiUrl } from "../configs/api.config";
import { ApiController } from "../commons/constants/api.controller";
import axios from 'axios';

const orderApiUrl = getApiUrl(ApiController.InvoicesApi.Orders);

const getListOrderByUserId = (userId) => {
    const URL = orderApiUrl + userId;
    return axios.get(URL);
}

const getOrderById = (orderId) => {
    const URL = orderApiUrl + orderId;
    return axios.get(URL);
}

const addNewOrder = (order) => {
    return axios.post(orderApiUrl, order);
}

const cancelOrder = (orderId) => {
    return axios.put(orderApiUrl + 'canceled-time/' + orderId);
}

export const orderService = {
    getListOrderByUserId,
    getOrderById,
    addNewOrder,
    cancelOrder
}