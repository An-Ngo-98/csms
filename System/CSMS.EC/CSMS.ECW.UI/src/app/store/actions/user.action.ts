import { Action } from '@ngrx/store';
import { User, UserToUpdate, UserReview, UserItemReview, Socialusers } from 'app/models/user.model';
import { ErrorAction } from 'app/models/error-action.class';
import { Address } from 'app/models/address.model';

export enum UserActionTypes {
    GetInfoFromTokenAction = '[User] Get Info From Token',
    GetInfoFromTokenSuccessAction = '[User] Get Info From Token Success',
    GetInfoFromTokenFailureAction = '[User] Get Info From Token Failure',

    UpdateProfileAction = '[User] Update Profile',
    UpdateProfileSuccessAction = '[User] Update Profile Success',
    UpdateProfileFailureAction = '[User] Update Profile Failure',

    UpdateImageUserAction = '[User] Update Image User',
    UpdateImageUserSuccessAction = '[User] Update Image User Success',
    UpdateImageUserFailureAction = '[User] Update Image User Failure',

    GetReviewByUserIdAction = '[User] Get Review By User Id',
    GetReviewByUserIdSuccessAction = '[User] Get Review By User Id Success',
    GetReviewByUserIdFailureAction = '[User] Get Review By User Id Failure',
}

export class GetInfoFromToken implements Action {
    public readonly type = UserActionTypes.GetInfoFromTokenAction;
    constructor(public token: string) {}
}

export class GetInfoFromTokenSuccess implements Action {
    public readonly type = UserActionTypes.GetInfoFromTokenSuccessAction;
    constructor(public user: User) {}
}

export class GetInfoFromTokenFailure implements ErrorAction {
    public readonly type = UserActionTypes.GetInfoFromTokenFailureAction;
    constructor() {}
}

export class UpdateProfile implements Action {
    public readonly type = UserActionTypes.UpdateProfileAction;
    constructor(public userToUpdate: UserToUpdate) {}
}

export class UpdateProfileSuccess implements Action {
    public readonly type = UserActionTypes.UpdateProfileSuccessAction;
    constructor(public user: User) {}
}

export class UpdateProfileFailure implements ErrorAction {
    public readonly type = UserActionTypes.UpdateProfileFailureAction;
    constructor() {}
}

export class UpdateImageUser implements Action {
    public readonly type = UserActionTypes.UpdateImageUserAction;
    constructor(public userId: number, public file: File) {}
}

export class UpdateImageUserSuccess implements Action {
    public readonly type = UserActionTypes.UpdateImageUserSuccessAction;
    constructor() {}
}

export class UpdateImageUserFailure implements ErrorAction {
    public readonly type = UserActionTypes.UpdateImageUserFailureAction;
    constructor() {}
}

export class GetReviewByUserId implements Action {
    public readonly type = UserActionTypes.GetReviewByUserIdAction;
    constructor (public userId: string) {}
}

export class GetReviewByUserIdSuccess implements Action {
    public readonly type = UserActionTypes.GetReviewByUserIdSuccessAction;
    constructor (public userReview: UserItemReview[]) {}
}

export class GetReviewByUserIdFailure implements ErrorAction {
    public readonly type = UserActionTypes.GetReviewByUserIdFailureAction;
    constructor () {}
}

export type UserActionUnion =
    | GetInfoFromToken
    | GetInfoFromTokenSuccess
    | GetInfoFromTokenFailure
    | UpdateProfile
    | UpdateProfileSuccess
    | UpdateProfileFailure
    | UpdateImageUser
    | UpdateImageUserSuccess
    | UpdateImageUserFailure
    | GetReviewByUserId
    | GetReviewByUserIdSuccess
    | GetReviewByUserIdFailure;
