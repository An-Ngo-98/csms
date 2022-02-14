import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import {
    GetAddress,
    GetAddressSuccess,
    GetAddressFailure,
    AddressActionTypes,
    CreateAddress,
    CreateAddressSuccess,
    CreateAddressFailure,
    UpdateAddress,
    UpdateAddresSuccess,
    UpdateAddessFailure,
    DeleteAddress,
    DeleteAddressSuccess,
    DeleteAddressFailure,
} from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { Address } from 'app/models/address.model';
import { AddressService } from 'app/services/user/address.service';
@Injectable()
export class AddressEffects {
    @Effect() public getAddress$: Observable<Action> = this.actions$.pipe(
        ofType<GetAddress>(AddressActionTypes.GetAddressAction),
        switchMap(action =>
            this.addressService.getAddress(action.userId).pipe(
                mergeMap((address: Address[]) => [new GetAddressSuccess(address)]),
                catchError(err => of(new GetAddressFailure())),
            ),
        ),
    );

    @Effect() public createAddress$: Observable<Action> = this.actions$.pipe(
        ofType<CreateAddress>(AddressActionTypes.CreateAddressAction),
        switchMap(action =>
            this.addressService.createAddress(action.createAddress).pipe(
                mergeMap((address: Address) => [new CreateAddressSuccess(address)]),
                catchError(err => of(new CreateAddressFailure())),
            ),
        ),
    );

    @Effect() public updateAddress$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateAddress>(AddressActionTypes.UpdateAddressAction),
        switchMap(action =>
            this.addressService.updateAddress(action.addressUpdate).pipe(
                mergeMap((address: Address) => [new UpdateAddresSuccess(address)]),
                catchError(err => of(new UpdateAddessFailure())),
            ),
        ),
    );

    @Effect() public deleteAddress$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteAddress>(AddressActionTypes.DeleteAddressAction),
        switchMap(action =>
            this.addressService.deleteAddress(action.addressId).pipe(
                mergeMap(() => [new DeleteAddressSuccess(action.addressId)]),
                catchError(err => of(new DeleteAddressFailure())),
            ),
        ),
    );

    constructor(private actions$: Actions, private addressService: AddressService, private store: Store<AppState>) { }
}
