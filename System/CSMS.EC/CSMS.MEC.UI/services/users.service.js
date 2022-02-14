import { getApiUrl } from "../configs/api.config";
import { ApiController } from "../commons/constants/api.controller";
import axios from 'axios';

const accountUrl = getApiUrl(ApiController.UsersApi.Account);
const customerUrl = getApiUrl(ApiController.UsersApi.Customer);
const userUrl = getApiUrl(ApiController.UsersApi.User);
const coinInvoicesUrl = getApiUrl(ApiController.InvoicesApi.Coins);

function login(username, password) {
    const postParam = {
        username: username,
        password: password
    };
    return new Promise((resolve, reject) => {
        axios.post(accountUrl + 'customer/login', postParam)
            .then(res => {
                if (res.data) {
                    resolve(res.data);
                } else {
                    reject(res)
                }
            })
            .catch(err => reject(err))
    });
}

function registerAccount(userInfo) {
    return new Promise((resolve, reject) => {
        axios.post(accountUrl + 'customer/register', userInfo)
            .then(res => {
                if (res.data) {
                    resolve(res.data);
                } else {
                    reject(res)
                }
            })
            .catch(err => reject(err))
    });
}

function updateUserInfo(userInfo) {
    return new Promise((resolve, reject) => {
        axios.put(customerUrl + 'update-information', userInfo)
            .then(res => {
                if (res.data) {
                    resolve(res.data);
                } else {
                    reject(res)
                }
            })
            .catch(err => reject(err))
    });
}

function getInfoFromAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
        const accessTokenJson = {
            accessToken: accessToken
        };

        axios.post(accountUrl + 'customer/get-info-from-access-token', accessTokenJson)
            .then(res => {
                if (res.data) {
                    resolve(res);
                } else {
                    reject(res)
                }
            })
            .catch(err => reject(err))
    });
}

const updatePassword = async (passwordViewModel) => {
    const response = await axios.put(accountUrl + 'change-password', passwordViewModel);
    return response.data;
}

const getListAddress = async (userId) => {
    return await axios.get(customerUrl + 'addresses/' + userId);
}

const getUserCoins = async (userId) => {
    return await axios.get(coinInvoicesUrl + userId);
}

const getUserCoinHistory = async (userId) => {
    return await axios.get(coinInvoicesUrl + 'history/' + userId);
}

const deleteAddress = async (addressId) => {
    return await axios.delete(userUrl + 'DeleteUserAddress/' + addressId);
}

const saveAddress = async (address) => {
    return await axios.post(userUrl + 'SaveUserAddress', address);
}

export const userService = {
    login,
    registerAccount,
    updateUserInfo,
    updatePassword,
    getInfoFromAccessToken,
    getListAddress,
    saveAddress,
    deleteAddress,
    getUserCoins,
    getUserCoinHistory
};