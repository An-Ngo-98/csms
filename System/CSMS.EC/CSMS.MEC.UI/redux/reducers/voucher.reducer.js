import { voucherConstants } from '../../commons/constants';

export default function voucherReducer(state = [], action = {}) {

    switch (action.type) {
        case voucherConstants.GET_VOUCHER_LOADING:
            return {
                isLoading: true,
                isError: false,
                isSuccess: false,
                errors: null,
                vouchers: null
            }

        case voucherConstants.GET_VOUCHER_SUCCESS:
            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                errors: null,
                vouchers: action.payload
            }

        case voucherConstants.GET_VOUCHER_FAIL:
            return {
                isLoading: false,
                isError: true,
                isSuccess: false,
                errors: action.payload,
                vouchers: null
            }

        case voucherConstants.UPDATE_VOUCHER_UNITS: {
            const voucher = action.payload;
            const vouchers = state;
            const updatedVoucher = updateVoucherUnits(vouchers, voucher);

            return {
                isLoading: false,
                isError: false,
                isSuccess: true,
                errors: null,
                vouchers: updatedVoucher
            }
        }
    }

    return state;
}

const findVoucherIndex = (vouchers, voucherID) => {
    return vouchers.findIndex(p => p.id === voucherID);
};

const updateVoucherUnits = (vouchers, voucher) => {
    const voucherIndex = findVoucherIndex(vouchers, voucher.id);
    const updatedCart = [...vouchers];
    const existingVoucher = updatedCart[voucherIndex];
    const updatedUnitsVoucher = { ...existingVoucher, units: voucher.units };

    updatedCart[voucherIndex] = updatedUnitsVoucher;

    return updatedCart;
};