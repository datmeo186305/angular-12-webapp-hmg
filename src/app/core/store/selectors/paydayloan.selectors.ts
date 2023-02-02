import * as fromFeature from '../reducers';
import { createSelector } from '@ngrx/store';

// selectors
export const getEkycInfo = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.ekycInfo
);

export const displayStepProgressBar = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showStepProgressBar
);

export const displayStepNavigation = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showStepNavigation
);

export const displayProfileBtn = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showProfileBtn
);

export const displayLeftBtn = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showLeftBtn
);

export const displayRightBtn = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showRightBtn
);

export const displayNavigationBar = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showNavigationBar
);

export const getNavigationTitle = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.navigationTitle
);

export const getStepNavigationInfo = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.stepNavigationInfo
);

export const isSignContractTermsSuccess = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.signContractTermsSuccess
);

export const isSignContractSuccess = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.signContractSuccess
);


export const isSentOtpOnsign = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.isSentOtpOnsign
);

export const isHasActiveLoan = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.hasActiveLoan
);

export const getCurrentLoanCode = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.currentLoanCode
);

export const getIsSignContractTermsStatus = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.isSignContractTermsStatus
);

export const getLoadingStatus = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.showLoading
);

export const getLoadingContent = createSelector(
  fromFeature.getCoreState,
  (state: fromFeature.State) => state.paydayLoan.loadingContent
);
