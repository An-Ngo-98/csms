import { Action } from '@ngrx/store';
import { ErrorAction } from 'app/models/error-action.class';
import { Branch, BranchItem } from 'app/models/branch.models';

export enum BranchActionTypes {
    LoadBranchAction = '[Branch] Load Branch',
    LoadBranchSuccessAction = '[Branch] Load Branch Success',
    LoadBranchFailureAction = '[Branch] Load Branch Failure',

    LoadBranchEnableAction = '[Branch] Load Branch Enable',
    LoadBranchEnableSuccessAction = '[Branch] Load Branch Enable Success',
    LoadBranchEnableFailureAction = '[Branch] Load Branch Enable Failure',
}

export class LoadBranch implements Action {
    public readonly type = BranchActionTypes.LoadBranchAction;
    constructor() {}
}

export class LoadBranchSuccess implements Action {
    public readonly type = BranchActionTypes.LoadBranchSuccessAction;
    constructor(public branchs: BranchItem) {}
}

export class LoadBranchFailure implements ErrorAction {
    public readonly type = BranchActionTypes.LoadBranchFailureAction;
    constructor() {}
}

export class LoadBranchEnable implements Action {
    public readonly type = BranchActionTypes.LoadBranchEnableAction;
    constructor() {}
}

export class LoadBranchEnableSuccess implements Action {
    public readonly type = BranchActionTypes.LoadBranchEnableSuccessAction;
    constructor(public branchs: Branch[]) {}
}

export class LoadBranchEnableFailure implements ErrorAction {
    public readonly type = BranchActionTypes.LoadBranchEnableFailureAction;
    constructor() {}
}

export type BranchActionUnion =
    | LoadBranch
    | LoadBranchSuccess
    | LoadBranchFailure
    | LoadBranchEnable
    | LoadBranchEnableSuccess
    | LoadBranchEnableFailure;

