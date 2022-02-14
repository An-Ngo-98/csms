import { combineReducers } from 'redux';
import { userConstants } from '../../commons/constants'

const getUser = (state = {}, action) => {
    switch (action.type) {

        case userConstants.GET_USER_LOADING:
            return {
                isLoading: true,
                isError: false,
                isSuccess: false,
                userDetails: null,
                errors: null
            }

        case userConstants.GET_USER_SUCCESS:
            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                userDetails: action.payload,
                errors: null
            }

        case userConstants.GET_USER_FAIL:
            return {
                isLoading: false,
                isError: true,
                isSuccess: false,
                userDetails: null,
                errors: action.payload
            }

        case userConstants.USER_LOGGED_OUT_SUCCESS:
            return {
                userDetails: null
            }

        default:
            return state;
    }
}

const updateUser = (state = {}, action) => {
    switch (action.type) {

        case userConstants.UPDATE_USER_LOADING:
            return {
                isLoading: true,
                isError: false,
                isSuccess: false,
                errors: null
            }

        case userConstants.UPDATE_USER_SUCCESS:
            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                errors: null
            }

        case userConstants.UPDATE_USER_FAILULE:
            return {
                isLoading: false,
                isError: true,
                isSuccess: false,
                errors: action.payload
            }

        default:
            return state;
    }
}

const getCoins = (state = {}, action) => {
    switch (action.type) {

        case userConstants.GET_COIN_LOADING:
            return {
                isLoading: true,
                isError: false,
                isSuccess: false,
                coins: null,
                errors: null
            }

        case userConstants.GET_COIN_SUCCESS:
            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                coins: action.payload,
                errors: null
            }

        case userConstants.GET_COIN_FAILULE:
            return {
                isLoading: false,
                isError: true,
                isSuccess: false,
                coins: null,
                errors: action.payload
            }

        case userConstants.CLEAR_COIN:
            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                coins: 0,
                errors: action.payload
            }

        default:
            return state;
    }
}

export default combineReducers({
    getUser,
    updateUser,
    getCoins
});
