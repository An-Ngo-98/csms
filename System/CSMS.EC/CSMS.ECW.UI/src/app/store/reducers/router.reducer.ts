import { createFeatureSelector } from '@ngrx/store';
import { Params, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export type State = RouterReducerState<RouterStateUrl>;

// TODO: check from fuse
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  public serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}

export const getRouterFeatureState = createFeatureSelector<State>('router');
