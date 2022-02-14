import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import {
    AuthActionTypes,
    LoginFailure,
    CreateUserFailure,
    UserActionTypes,
    UpdateProfileFailure,
    AddressActionTypes,
    CreateAddressFailure,
    DeleteAddressFailure,
    UpdateAddessFailure,
    ChangePasswordFailure,
    CartActionTypes,
    DeleteProductFromCartFailure,
    OrderActionTypes,
    OrderFailure,
    ProductActionTypes,
    SaveReviewProductFailure,
    LogoutFailure,
    CancelOrderFailure,
    DeleteProductBuyLaterFailure,
    BuyLaterProductFailure,
    UpdateImageUserFailure} from '../actions';
import { switchMap } from 'rxjs/operators';
import { ShowSnackbar } from '../actions/snackbar.action';

@Injectable()
export class FailureEffect {
    @Effect() public failure$: Observable<Action> = this.actions$.pipe(
        ofType<ErrorAction>(
            AuthActionTypes.LoginActionFailure,
            AuthActionTypes.CreateUserFailureAction,
            UserActionTypes.UpdateProfileFailureAction,
            AddressActionTypes.CreateAddressFailureAction,
            AddressActionTypes.DeleteAddressFailureAction,
            AddressActionTypes.UpdateAddressFailureAction,
            AuthActionTypes.ChangePasswordFailureAction,
            CartActionTypes.DeleteProductFromCartFailureAction,
            OrderActionTypes.OrderFailureAction,
            ProductActionTypes.SaveReviewProductFailureAction,
            AuthActionTypes.LogoutFailureAction,
            CartActionTypes.DeleteProductFromCartFailureAction,
            OrderActionTypes.CancelOrderFailureAction,
            ProductActionTypes.DeleteBuyLaterProductFailureAction,
            ProductActionTypes.BuyLaterProductFailureAction,
            UserActionTypes.UpdateImageUserFailureAction
            ),
        switchMap(action => {
            let message;
            if (action instanceof LoginFailure) {
                message = 'Username or password incorrect';
            }
            if (
                action instanceof CreateUserFailure ||
                action instanceof UpdateProfileFailure ||
                action instanceof CreateAddressFailure ||
                action instanceof DeleteAddressFailure ||
                action instanceof UpdateAddessFailure ||
                action instanceof ChangePasswordFailure ||
                action instanceof DeleteProductFromCartFailure ||
                action instanceof OrderFailure ||
                action instanceof SaveReviewProductFailure ||
                action instanceof LogoutFailure ||
                action instanceof DeleteProductFromCartFailure ||
                action instanceof CancelOrderFailure ||
                action instanceof DeleteProductBuyLaterFailure ||
                action instanceof BuyLaterProductFailure ||
                action instanceof UpdateImageUserFailure
                ) {
                message = 'Something went wrong';
            }
            return [
                new ShowSnackbar(
                    message,
                    'Done',
                    { duration: action.duration || 3000 },
                    action.action || undefined,
                ),
            ];
        }),
    );
    constructor(
        private actions$: Actions,
      ) {}
}

