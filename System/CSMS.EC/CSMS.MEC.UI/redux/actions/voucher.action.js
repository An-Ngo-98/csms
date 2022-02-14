import { voucherConstants } from '../../commons/constants';
import { voucherService } from '../../services';

const getVouchers = (userId) => {
    return async (dispatch) => {
        dispatch(request());

        let [vouchers, usedVouchers] = await Promise.all([voucherService.getVouchers(), voucherService.getUsedVouchers(userId)]);

        if (vouchers.status === 200 && usedVouchers.status === 200) {
            vouchers = vouchers.data;
            usedVouchers = usedVouchers.data;

            vouchers.forEach(item => {
                item.units = item.accountLimit ? item.accountLimit : 9999;
            });

            usedVouchers.forEach(item => {
                let voucher = vouchers.find(p => p.id === item.voucherId);
                if (voucher) {
                    voucher.units -= item.quantity;
                }
            });

            vouchers = vouchers.filter(item => item.units > 0);

            dispatch(success(vouchers));
            return new Object({ success: true });
        } else {
            dispatch(failure(error));
            return new Object({ success: false });
        }
    };
    function request() { return { type: voucherConstants.GET_VOUCHER_LOADING } }
    function success(vouchers) { return { type: voucherConstants.GET_VOUCHER_SUCCESS, payload: vouchers } }
    function failure(error) { return { type: voucherConstants.GET_VOUCHER_FAIL, payload: error } }
}

const updateVoucherUnit = (voucherId, units) => {
    return (dispatch) => {
        dispatch({ type: voucherConstants.UPDATE_VOUCHER_UNITS, payload: { voucherId, units } });
    }
}

export const voucherActions = {
    getVouchers,
    updateVoucherUnit
};