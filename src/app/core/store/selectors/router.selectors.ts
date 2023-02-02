import { createSelector } from "@ngrx/store";
import { getRouterState, RouterStateUrl } from "../reducers";
import * as fromFeature from "../reducers";


/**
 * Selectors
 */
export const getRouterParams = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => {
        return state.routerReducer?.state?.params ;
    }
);

export const getRouterQueryParams = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => {
        return state.routerReducer?.state?.queryParams ;
    }
);

export const getRouterCurrentUrl = createSelector(
  getRouterState,
  (routerData: {state:RouterStateUrl, navigationId: number}) => {
    return routerData.state.url;
  }
);

export const getRouterAllState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => {
        return state.routerReducer?.state;
    }
);
