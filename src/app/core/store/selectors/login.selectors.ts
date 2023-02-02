import * as fromFeature from '../reducers';
import {createSelector} from '@ngrx/store';

// selectors
export const getAuthorizationState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.login ? state.login.authorization : ''
);

export const getTokenState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => {
        return state.login.authorization ? state.login.authorization?.token : '';
    }
);

export const getCustomerIdState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.login ? state.login.authorization?.customerId : ''
);

export const getCustomerMobileState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.login ? state.login.customerMobile : ''
);

export const getAuthoritiesUserState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.login ? state.login.authorization?.authorities : []
);

export const getLoginErrorState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.login ? state.login.loginError : ''
);

export const getLoginProgressState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.login ? state.login.loginProcess : ''
);

export const getCoreTokenState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.login ? state.login.coreToken : ''
);

export const getPasswordState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.login ? state.login.password : ''
);
