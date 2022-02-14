import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VoucherActionUnion, VoucherActionTypes } from '../actions';
import { Voucher } from 'app/models/voucher.model';
export interface VoucherLoading {
    loadingEntities?: boolean;
    chooseEntity?: boolean;
}
export interface State {
    vouchers: Voucher[];
    chooseVoucher: Voucher;
    loading: VoucherLoading;
}
export const initialState: State =  {
    vouchers: [],
    chooseVoucher: undefined,
    loading: {}
}
export function reducer(state = initialState, action: VoucherActionUnion): State {
    switch (action.type) {
        case VoucherActionTypes.GetVoucherPromotionAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case VoucherActionTypes.GetVoucherPromotionSuccessAction: {
            return {
                ...state,
                vouchers: action.vouchers,
                loading: {...state.loading, loadingEntities: false}
            };
        }
        case VoucherActionTypes.GetVoucherPromotionFailureAction: {
            return {
                ...state,
                loading: {...state.loading, loadingEntities: true}
            }
        }
        case VoucherActionTypes.ChooseVoucherAction: {
            return {
                ...state,
                loading: {...state.loading, chooseEntity: true}
            }
        }
        case VoucherActionTypes.ChooseVoucherSuccessAction: {
            return {
                ...state,
                chooseVoucher: action.vouchers,
                loading: {...state.loading, chooseEntity: false}
            }
        }
        case VoucherActionTypes.ChooseVoucherFailureAction: {
            return {
                ...state,
                loading: {...state.loading, chooseEntity: true}
            }
        }
        default:
            return state;
    }
}
export const getVouchersFeatureState = createFeatureSelector<State>('vouchers');

export const voucherSelector = createSelector(
    getVouchersFeatureState,
    (state: State) => state.vouchers,
);

export const chooseVoucherSelector = createSelector(
    getVouchersFeatureState,
    (state: State) => state.chooseVoucher,
);
export const voucherLoadingSelector = createSelector(
    getVouchersFeatureState,
    (state: State) => state.loading,
);

