import { userConstants } from '../../commons/constants';
import { userService } from '../../services';

const updateUser = (userInfo) => {
    return async (dispatch) => {
        dispatch(request());
        return userService.updateUserInfo(userInfo)
            .then(res => {
                if (res.succeeded) {
                    dispatch(success());
                    dispatch(successWithData(res.data));
                    return res;
                } else {
                    dispatch(failure(res.errors));
                    return res;
                }
            })
            .catch(error => {
                dispatch(failure(error));
                return new Object({ succeeded: false });
            });
    };
    function request() { return { type: userConstants.UPDATE_USER_LOADING } }
    function success() { return { type: userConstants.UPDATE_USER_SUCCESS } }
    function successWithData(user) { return { type: userConstants.GET_USER_SUCCESS, payload: user } }
    function failure(error) { return { type: userConstants.UPDATE_USER_FAILULE, payload: error } }
}

const getInfoFromAccessToken = (accessToken) => {
    return async (dispatch) => {
        userService.getInfoFromAccessToken(accessToken)
            .then(res => {
                if (res.status === 200) {
                    dispatch(success(res.data));
                }
            })
            .catch();
    };
    function success(userInfo) { return { type: userConstants.GET_USER_SUCCESS, payload: userInfo } }
}

const getCoins = (userId) => {
    return async (dispatch) => {
        dispatch(request());
        userService.getUserCoins(userId)
            .then(res => {
                if (res.status === 200) {
                    dispatch(success(res.data));
                } else {
                    dispatch(failure(res.errors));
                }
            })
            .catch(error => {
                dispatch(failure(error));
                return new Object({ succeeded: false });
            });
    };
    function request() { return { type: userConstants.GET_COIN_LOADING } }
    function success(coins) { return { type: userConstants.GET_COIN_SUCCESS, payload: coins  } }
    function failure(error) { return { type: userConstants.GET_COIN_FAILULE, payload: error } }
}

const clearCoins = () => {
    return (dispatch) => {
        dispatch({ type: userConstants.CLEAR_COIN });
    }
}

export const userActions = {
    updateUser,
    getInfoFromAccessToken,
    getCoins,
    clearCoins
};