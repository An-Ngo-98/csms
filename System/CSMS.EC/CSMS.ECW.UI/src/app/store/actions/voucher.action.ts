import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { Category, CategoryItem } from 'app/models/category.model';
import { Voucher } from 'app/models/voucher.model';

export enum VoucherActionTypes {
    GetVoucherPromotionAction = '[Voucher] Get Voucher',
    GetVoucherPromotionSuccessAction = '[Voucher] Get Voucher Success',
    GetVoucherPromotionFailureAction = '[Voucher] Get Voucher Failure',

    ChooseVoucherAction = '[Voucher] Choose Voucher',
    ChooseVoucherSuccessAction = '[Voucher] Choose Voucher Success',
    ChooseVoucherFailureAction = '[Voucher] Choose Voucher Failure'
}

export class GetVoucher implements Action {
    public readonly type = VoucherActionTypes.GetVoucherPromotionAction;
    constructor() {}
}

export class GetVoucherSuccess implements Action {
    public readonly type = VoucherActionTypes.GetVoucherPromotionSuccessAction;
    constructor(public vouchers: Voucher[]) {}
}

export class GetVoucherFailure implements ErrorAction {
    public readonly type = VoucherActionTypes.GetVoucherPromotionFailureAction;
    constructor() {}
}

export class ChooseVoucher implements Action {
    public readonly type = VoucherActionTypes.ChooseVoucherAction;
    constructor(public vouchers: Voucher) {}
}

export class ChooseVoucherSuccess implements Action {
    public readonly type = VoucherActionTypes.ChooseVoucherSuccessAction;
    constructor(public vouchers: Voucher) {}
}

export class ChooseVoucherFailure implements ErrorAction {
    public readonly type = VoucherActionTypes.ChooseVoucherFailureAction;
    constructor() {}
}

export type VoucherActionUnion =
    | GetVoucher
    | GetVoucherSuccess
    | GetVoucherFailure
    | ChooseVoucher
    | ChooseVoucherFailure
    | ChooseVoucherSuccess;
