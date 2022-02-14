import { Action } from '@ngrx/store';

/**
 * IMPORTANT, README
 * Register your ErrorActions in src/app/effects/failure.effects.ts
 *
 * @export
 * @interface ErrorAction
 * @extends {Action}
 */
export interface ErrorAction extends Action {
  /**
   * Defines the error message
   *
   * @type {string}
   * @memberof ErrorAction
   */
  error?: string;
  /**
   * If true, shows a popup explaining something went wrong
   *
   * @optional
   * @default false
   * @type {boolean}
   * @memberof ErrorAction
   */
  critical?: boolean;
  /**
   * If true, shows a snackbar with the error message
   *
   * @optional
   * @default true
   * @type {boolean}
   * @memberof ErrorAction
   */
  showSnackbar?: boolean;
  /**
   * The action label to show on the right of the snackbar
   *
   * @optional
   * @default 'DONE'
   * @type {string}
   * @memberof ErrorAction
   */
  actionLabel?: string;
  /**
   * The duration of the snackbar
   *
   * @optional
   * @default 300ms
   * @type {number}
   * @memberof ErrorAction
   */
  duration?: number;
  /**
   * The action to dispatch if actionLabel is clicked
   *
   * @optional
   * @default null
   * @type {Action}
   * @memberof ErrorAction
   */
  action?: Action;
  /**
   * The http status code of the failed request. If 401, redirects to login
   *
   * @optional
   * @default null
   * @type {number}
   * @memberof ErrorAction
   */
  httpStatusCode?: number;
}
