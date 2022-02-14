import { MatSnackBarConfig } from '@angular/material';
import { Action } from '@ngrx/store';

export enum SnackbarActionTypes {
  ShowSnackbarAction = '[Snackbar] Show snackbar',
}

export class ShowSnackbar implements Action {
  public readonly type = SnackbarActionTypes.ShowSnackbarAction;

  constructor(
    public message: string,
    public actionLabel: string,
    public config: MatSnackBarConfig,
    public toDispatchOnAction: Action,
  ) {}
}

export type SnackbarActions = ShowSnackbar;
