import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import {
    AuthActionTypes,
    LoginSuccess,
    LogoutSuccess,
    CreateUserSuccess,
    UserActionTypes,
    UpdateProfileSuccess,
    AddressActionTypes,
    CreateAddressSuccess,
    UpdateAddresSuccess,
    DeleteAddressSuccess,
    ChangePasswordSuccess,
    CartActionTypes,
    DeleteProductFromCartSuccess,
    OrderActionTypes,
    OrderSuccess,
    ProductActionTypes,
    SaveReviewProductSuccess,
    CancelOrderSuccess,
    BuyLaterProductSuccess,
    DeleteProductBuyLaterSuccess,
    UpdateImageUserSuccess} from '../actions';
import { switchMap } from 'rxjs/operators';
import { ShowSnackbar } from '../actions/snackbar.action';

@Injectable()
export class SuccessEffect {
    @Effect() public messageSuccess$: Observable<Action> = this.actions$.pipe(
        ofType<Action>(
            AuthActionTypes.LoginSuccessAction,
            AuthActionTypes.LogoutSuccessAction,
            AuthActionTypes.CreateUserSuccessAction,
            UserActionTypes.UpdateProfileSuccessAction,
            AddressActionTypes.CreateAddressSuccessAction,
            AddressActionTypes.DeleteAddressSuccessAction,
            AddressActionTypes.UpdateAddressSuccessAction,
            AuthActionTypes.ChangePasswordSuccessAction,
            CartActionTypes.DeleteProductFromCartSuccessAction,
            OrderActionTypes.OrderSuccessAction,
            ProductActionTypes.SaveReviewProductSuccessAction,
            CartActionTypes.DeleteProductFromCartSuccessAction,
            OrderActionTypes.CancelOrderSuccessAction,
            ProductActionTypes.BuyLaterProductSuccessAction,
            ProductActionTypes.DeleteBuyLaterProductSuccessAction,
            UserActionTypes.UpdateImageUserSuccessAction
        ),
        switchMap(action => {
            let message = 'Success';
            if (action instanceof LoginSuccess) {
                message = 'Login success';
            }
            if (action instanceof LogoutSuccess) {
                message = 'Logout success';
            }
            if (action instanceof CreateUserSuccess) {
                message = 'Signup success';
            }
            if (action instanceof UpdateProfileSuccess) {
                message = 'Update profile success';
            }
            if (action instanceof CreateAddressSuccess) {
                message = 'Create address success';
            }
            if (action instanceof UpdateAddresSuccess) {
                message = 'Update address success';
            }
            if (action instanceof DeleteAddressSuccess) {
                message = 'Delete address success';
            }
            if (action instanceof ChangePasswordSuccess) {
                message = 'Change password success';
            }
            if (action instanceof DeleteProductFromCartSuccess) {
                message = 'Delete product success';
            }
            if (action instanceof OrderSuccess) {
                message = 'Order success';
            }
            if (action instanceof SaveReviewProductSuccess) {
                message = 'Review product success';
            }
            if (action instanceof DeleteProductFromCartSuccess) {
                message = 'Delete product success';
            }
            if (action instanceof CancelOrderSuccess) {
                message = 'Cancel order success';
            }
            if (action instanceof BuyLaterProductSuccess) {
                message = 'Add buy later success';
            }
            if (action instanceof DeleteProductBuyLaterSuccess) {
                message = 'Delete buy later success';
            }
            if (action instanceof UpdateImageUserSuccess) {
                message = 'Update image success';
            }
            return [
                new ShowSnackbar(
                    message,
                    'DONE',
                    { duration: 3000 },
                    undefined,
                ),
            ];
        })
    )
    constructor(private actions$: Actions) { }
}

