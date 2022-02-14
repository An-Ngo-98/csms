import { accountConstants, userConstants } from '../../commons/constants';
import { userService } from '../../services';

const loginUser = (username, password) => {
    return async (dispatch) => {
        dispatch(request());
        return userService.login(username, password)
            .then(res => {
                dispatch(success());
                dispatch(authSuccess(res.accessToken));
                dispatch(getDataSuccess(res));
                return new Object({ success: true });
            })
            .catch(error => {
                dispatch(failure(error));
                return new Object({ success: false });
            });
    };
    function request() { return { type: accountConstants.LOGIN_LOADING } }
    function success() { return { type: accountConstants.LOGIN_SUCCESS } }
    function authSuccess(token) { return { type: accountConstants.AUTH_USER_SUCCESS, payload: token } }
    function getDataSuccess(user) { return { type: userConstants.GET_USER_SUCCESS, payload: user } }
    function failure(error) { return { type: accountConstants.LOGIN_FAILURE, payload: error } }
}

const logoutUser = () => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_LOGGED_OUT_SUCCESS });
        dispatch({ type: accountConstants.AUTH_USER_FAILURE });
    }
}

const createNewUser = (userInfo) => {
    return async (dispatch) => {
        dispatch(request());
        return userService.registerAccount(userInfo)
            .then(res => {
                if (res.succeeded) {
                    dispatch(success());
                    dispatch(authSuccess(res.data.accessToken));
                    dispatch(getDataSuccess(res.data));
                } else {
                    dispatch(failure(res.errors));
                }
                return res;
            })
            .catch(error => {
                dispatch(failure(error));
                return new Object({ success: false });
            });
    };
    function request() { return { type: accountConstants.CREATE_USER_LOADING } }
    function success() { return { type: accountConstants.CREATE_USER_SUCCESS } }
    function authSuccess(token) { return { type: accountConstants.AUTH_USER_SUCCESS, payload: token } }
    function getDataSuccess(user) { return { type: userConstants.GET_USER_SUCCESS, payload: user } }
    function failure(error) { return { type: accountConstants.CREATE_USER_FAILURE, payload: error } }
}

export const authActions = {
    loginUser,
    logoutUser,
    createNewUser
};