import { Action } from '@ngrx/store';
import { User, UserToUpdate } from 'app/models/user.model';
import { ErrorAction } from 'app/models/error-action.class';
import { Address, AddressToUpdate, AddressToCreate } from 'app/models/address.model';

export enum AddressActionTypes {
    GetAddressAction = '[User] Get Address',
    GetAddressSuccessAction = '[User] Get Address Success',
    GetAddressFailureAction = '[User] Get Address Failure',

    CreateAddressAction = '[User] Create Address',
    CreateAddressSuccessAction = '[User] Create Address Success',
    CreateAddressFailureAction = '[User] Create Address Failure',

    UpdateAddressAction = '[User] Update Address',
    UpdateAddressSuccessAction = '[User] Update Address Success',
    UpdateAddressFailureAction = '[User] Update Address Failure',

    DeleteAddressAction = '[User] Delete Address',
    DeleteAddressSuccessAction = '[User] Delete Address Success',
    DeleteAddressFailureAction = '[User] Delete Address Failure',
}

export class GetAddress implements Action {
    public readonly type = AddressActionTypes.GetAddressAction;
    constructor(public userId: string) {}
}

export class GetAddressSuccess implements Action {
    public readonly type = AddressActionTypes.GetAddressSuccessAction;
    constructor(public address: Address[]) {}
}

export class GetAddressFailure implements ErrorAction {
    public readonly type = AddressActionTypes.GetAddressFailureAction;
    constructor() {}
}

export class CreateAddress implements Action {
    public readonly type = AddressActionTypes.CreateAddressAction;
    constructor(public createAddress: AddressToCreate) {}
}

export class CreateAddressSuccess implements Action {
    public readonly type = AddressActionTypes.CreateAddressSuccessAction;
    constructor(public address: Address) {}
}

export class CreateAddressFailure implements ErrorAction {
    public readonly type = AddressActionTypes.CreateAddressFailureAction;
    constructor() {}
}

export class UpdateAddress implements Action {
    public readonly type = AddressActionTypes.UpdateAddressAction;
    constructor(public addressUpdate: AddressToUpdate) {}
}

export class UpdateAddresSuccess implements Action {
    public readonly type = AddressActionTypes.UpdateAddressSuccessAction;
    constructor(public address: Address) {}
}

export class UpdateAddessFailure implements ErrorAction {
    public readonly type = AddressActionTypes.UpdateAddressFailureAction;
    constructor() {}
}

export class DeleteAddress implements Action {
    public readonly type = AddressActionTypes.DeleteAddressAction;
    constructor(public addressId: string) {}
}

export class DeleteAddressSuccess implements Action {
    public readonly type = AddressActionTypes.DeleteAddressSuccessAction;
    constructor(public addressId: string) {}
}

export class DeleteAddressFailure implements ErrorAction {
    public readonly type = AddressActionTypes.DeleteAddressFailureAction;
    constructor() {}
}

export type AddressActionUnion =
    | GetAddress
    | GetAddressSuccess
    | GetAddressFailure
    | CreateAddress
    | CreateAddressSuccess
    | CreateAddressFailure
    | UpdateAddress
    | UpdateAddresSuccess
    | UpdateAddessFailure
    | DeleteAddress
    | DeleteAddressSuccess
    | DeleteAddressFailure;
