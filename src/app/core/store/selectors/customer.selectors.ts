import * as fromFeature from '../reducers';
import {createSelector} from '@ngrx/store';

// selectors
export const getCustomerInfoState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.customer.customerInfo
);

export const getCustomerErrorState = createSelector(
    fromFeature.getCoreState,
    (state: fromFeature.State) => state.customer ? state.customer.getCustomerError : ''
);

export const getRatingState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.customer ? state.customer.rateInfo : null
);

export const getLoanDeterminationState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => (state.customer ? state.customer.loanDetermination : null)
);

export const getVirtualAccountInfoState = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => (state.customer ? state.customer.virtualAccountInfo : null)
);

