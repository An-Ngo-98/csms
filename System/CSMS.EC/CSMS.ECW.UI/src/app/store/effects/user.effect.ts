import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import {
    GetInfoFromToken,
    UserActionTypes,
    GetInfoFromTokenSuccess,
    GetInfoFromTokenFailure,
    UpdateProfile,
    UpdateProfileSuccess,
    UpdateProfileFailure,
    GetReviewByUserId,
    GetReviewByUserIdSuccess,
    GetReviewByUserIdFailure,
} from '../actions';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { UserService } from 'app/services/user/user.service';
import { User, UserReview, UserItemReview } from 'app/models/user.model';
@Injectable()
export class UserEffects {
    @Effect() public getUserInfoFromToken$: Observable<Action> = this.actions$.pipe(
        ofType<GetInfoFromToken>(UserActionTypes.GetInfoFromTokenAction),
        switchMap(action =>
            this.userService.getUserInfoFromToken(action.token).pipe(
                mergeMap((user: User) => [new GetInfoFromTokenSuccess(user)]),
                catchError(err => of(new GetInfoFromTokenFailure())),
            ),
        ),
    );

    @Effect() public updateProfile$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateProfile>(UserActionTypes.UpdateProfileAction),
        switchMap(action =>
            this.userService.updateProfile(action.userToUpdate).pipe(
                mergeMap((user: User) => [new UpdateProfileSuccess(user)]),
                catchError(err => of(new UpdateProfileFailure())),
            ),
        ),
    );

    @Effect() public getReviewByUserId$: Observable<Action> = this.actions$.pipe(
        ofType<GetReviewByUserId>(UserActionTypes.GetReviewByUserIdAction),
        switchMap(action =>
            this.userService.getReviewByUserId(action.userId).pipe(
                mergeMap((userReview: UserItemReview[]) => [new GetReviewByUserIdSuccess(userReview)]),
                catchError(err => of(new GetReviewByUserIdFailure())),
            ),
        ),
    );

    constructor(private actions$: Actions, private userService: UserService, private store: Store<AppState>) { }
}
