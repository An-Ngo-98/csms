import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ShowSnackbar, SnackbarActionTypes } from '../actions/snackbar.action';
import { AppState } from '../reducers';

@Injectable()
export class SnackbarEffects {
  @Effect({ dispatch: false }) public showSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<ShowSnackbar>(SnackbarActionTypes.ShowSnackbarAction),
    tap((action: ShowSnackbar) => {
      const matSnackbarRef = this.matSnackbar.open(
        action.message,
        action.actionLabel,
        action.config,
      );
      if (action.toDispatchOnAction) {
        matSnackbarRef.onAction().subscribe(() => this.store.dispatch(action.toDispatchOnAction));
      }
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private matSnackbar: MatSnackBar,
  ) {}
}
