// import { Location } from '@angular/common';
// import { Injectable, NgZone } from '@angular/core';
// import { Router } from '@angular/router';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { map, tap } from 'rxjs/operators';

// import * as RouterActions from '../actions/router.action';

// @Injectable()
// export class RouterEffects {
//   @Effect({ dispatch: false }) public navigate$ = this.actions$.pipe(
//     ofType(RouterActions.GO),
//     map((action: RouterActions.Go) => action.payload),
//     tap(({ path, query: queryParams, extras }) => {
//       this.ngZone.run(() => {
//         this.router.navigate(path, { queryParams, ...extras });
//       });
//     }),
//   );

//   constructor(
//     private actions$: Actions,
//     private router: Router,
//     private location: Location,
//     private ngZone: NgZone,
//   ) {}
// }
