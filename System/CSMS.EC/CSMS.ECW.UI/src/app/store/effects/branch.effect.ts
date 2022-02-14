import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { LoadBranch, BranchActionTypes, LoadBranchSuccess, LoadBranchFailure,
    LoadBranchEnable,
    LoadBranchEnableSuccess,
    LoadBranchEnableFailure
} from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { BranchService } from 'app/services/system/branch.service';
import { Branch, BranchItem } from 'app/models/branch.models';

@Injectable()
export class BranchEffects {
    @Effect() public loadBranchs$: Observable<Action> = this.actions$.pipe(
        ofType<LoadBranch>(BranchActionTypes.LoadBranchAction),
        switchMap(action =>
            this.branchService.loadBranchs().pipe(
                mergeMap((branchs: BranchItem) => [new LoadBranchSuccess(branchs)]),
                catchError(err => of(new LoadBranchFailure())),
            ),
        ),
    );

    @Effect() public loadBranchsEnable$: Observable<Action> = this.actions$.pipe(
        ofType<LoadBranchEnable>(BranchActionTypes.LoadBranchEnableAction),
        switchMap(action =>
            this.branchService.loadBranchsEnable().pipe(
                mergeMap((branchs: Branch[]) => [new LoadBranchEnableSuccess(branchs)]),
                catchError(err => of(new LoadBranchEnableFailure())),
            ),
        ),
    );
    constructor(private actions$: Actions, private branchService: BranchService, private store: Store<AppState>) { }
}
