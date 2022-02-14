import { combineReducers } from 'redux';
import { systemConstants } from '../../commons/constants';

const branchReducer = (state = [], action = {}) => {

    switch (action.type) {
        case systemConstants.GET_ALL_BRANCHS: {
            return action.payload;
        }
    }

    return state;
}

const categoryReducer = (state = [], action = {}) => {

    switch (action.type) {
        case systemConstants.GET_ALL_CATEGORIES: {
            return action.payload;
        }
    }

    return state;
}

export default combineReducers({
    branchReducer,
    categoryReducer
});