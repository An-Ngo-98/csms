import { systemConstants } from '../../commons/constants';
import { categoryService, storeService } from '../../services';

const getCategories = () => {
    return async (dispatch) => {
        return categoryService.getEnableCategories()
            .then(res => {
                if (res.status === 200) {
                    dispatch(success(res.data));
                }
            })
            .catch(error => { });
    };

    function success(categories) { return { type: systemConstants.GET_ALL_CATEGORIES, payload: categories } }
}

const getBranchs = () => {
    return async (dispatch) => {
        return storeService.getEnableStores()
            .then(res => {
                if (res.status === 200) {
                    dispatch(success(res.data));
                    return res;
                }
            })
            .catch(error => { });
    };

    function success(branchs) { return { type: systemConstants.GET_ALL_BRANCHS, payload: branchs } }
}

export const systemActions = {
    getCategories,
    getBranchs
};