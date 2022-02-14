import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { GetVoucher,
    VoucherActionTypes,
    GetVoucherSuccess,
    GetVoucherFailure,
    ChooseVoucher,
    ChooseVoucherSuccess,
    ChooseVoucherFailure
} from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { VoucherService } from 'app/services/cart/voucher.service';
import { Voucher } from 'app/models/voucher.model';

@Injectable()
export class VoucherEffects {
    @Effect() public getVoucher$: Observable<Action> = this.actions$.pipe(
        ofType<GetVoucher>(VoucherActionTypes.GetVoucherPromotionAction),
        switchMap(action =>
            this.voucherService.getVoucher().pipe(
                mergeMap((vouchers: Voucher[]) => [new GetVoucherSuccess(vouchers)]),
                catchError(err => of(new GetVoucherFailure())),
            ),
        ),
    );

    // @Effect() public chooseVoucher$: Observable<Action> = this.actions$.pipe(
    //     ofType<ChooseVoucher>(VoucherActionTypes.ChooseVoucherAction),
    //     switchMap(action =>
    //         this.voucherService.chooseVoucher(action.vouchers).pipe(
    //             mergeMap((vouchers: Voucher[]) => [new ChooseVoucherSuccess(vouchers)]),
    //             catchError(err => of(new ChooseVoucherFailure())),
    //         ),
    //     ),
    // );
    @Effect() public chooseVoucher$: Observable<Action> = this.actions$.pipe(
        ofType<ChooseVoucher>(VoucherActionTypes.ChooseVoucherAction),
        switchMap(action =>
            this.voucherService.chooseVoucher(action.vouchers).pipe(
                mergeMap((vouchers: Voucher) => [new ChooseVoucherSuccess(vouchers)]),
                catchError(err => of(new ChooseVoucherFailure())),
            ),
        ),
    );
    constructor(private actions$: Actions, private voucherService: VoucherService, private store: Store<AppState>) { }
}
