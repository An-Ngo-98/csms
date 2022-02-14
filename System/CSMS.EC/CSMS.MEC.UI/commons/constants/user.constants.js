import { ApiController } from "./api.controller";
import { getApiUrl } from "../../configs/api.config";

export const userConstants = {
    GET_USER_LOADING: 'GET_USER_LOADING',
    GET_USER_SUCCESS: 'GET_USER_SUCCESS',
    GET_USER_FAILULE: 'GET_USER_FAILURE',

    UPDATE_USER_LOADING: 'UPDATE_USER_LOADING',
    UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
    UPDATE_USER_FAILULE: 'UPDATE_USER_FAILURE',

    GET_COIN_LOADING: 'GET_COIN_LOADING',
    GET_COIN_SUCCESS: 'GET_COIN_SUCCESS',
    GET_COIN_FAILULE: 'GET_COIN_FAILURE',
    CLEAR_COIN:       'CLEAR_COIN',

    USER_LOGGED_OUT_SUCCESS: 'USER_LOGGED_OUT_SUCCESS'
};

export const userAvatarUrl = getApiUrl(ApiController.CdnApi.UserAvatar) + '{id}/{size}';