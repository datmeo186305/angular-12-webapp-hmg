import * as fromActions from '../actions';
import { KalapaResponse } from '../../../../../open-api-modules/customer-api-docs';
import { StepNavigationInfo } from '../../../public/models/step-navigation.model';
import {
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_STEP_TITLE,
  PL_STEP_NAVIGATION,
} from '../../common/enum/payday-loan';
import {PlLoading} from "../../../public/models/plloading.model";

export interface PaydayLoanState {
  ekycInfo: KalapaResponse;
  showStepProgressBar: boolean;
  showStepNavigation: boolean;
  showProfileBtn: boolean;
  showLeftBtn: boolean;
  showRightBtn: boolean;
  navigationTitle: string;
  stepNavigationInfo: StepNavigationInfo;
  showNavigationBar: boolean;
  signContractTermsSuccess: boolean;
  signContractSuccess: boolean;
  isSentOtpOnsign: boolean;
  hasActiveLoan: boolean;
  currentLoanCode: string;
  isSignContractTermsStatus: boolean;
  showLoading: boolean;
  loadingContent: PlLoading;
}

export const PAYDAY_LOAN_INITIAL_STATE: PaydayLoanState = {
  ekycInfo: null,
  showStepProgressBar: false,
  showStepNavigation: false,
  showProfileBtn: false,
  showLeftBtn: false,
  showRightBtn: false,
  navigationTitle: 'Ứng lương 0% lãi',
  stepNavigationInfo: {
    currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
    lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
    stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
  },
  showNavigationBar: true,
  signContractTermsSuccess: false,
  signContractSuccess: false,
  isSentOtpOnsign: false,
  hasActiveLoan: false,
  currentLoanCode: null,
  isSignContractTermsStatus: false,
  showLoading: false,
  loadingContent: {},
};

class PaydayLoanActions {
  constructor(
    private state: PaydayLoanState,
    private action: fromActions.PaydayLoanActions
  ) {}

  setEkycInfo() {
    const payload = this.action.payload;

    return { ...this.state, ekycInfo: payload };
  }

  resetEkycInfo() {
    return { ...this.state, ekycInfo: null };
  }

  setShowStepProgressBar() {
    const payload = this.action.payload;

    return { ...this.state, showStepProgressBar: payload };
  }

  setShowStepNavigation() {
    const payload = this.action.payload;

    return { ...this.state, showStepNavigation: payload };
  }

  setStepNavigationInfo() {
    const step: PL_STEP_NAVIGATION = this.action.payload;

    return {
      ...this.state,
      stepNavigationInfo: {
        currentStep: PAYDAY_LOAN_STEP[step],
        lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
        stepTitle: PAYDAY_LOAN_STEP_TITLE[step],
      },
    };
  }

  resetStepNavigationInfo() {
    return {
      ...this.state,
      stepNavigationInfo: {
        currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
        lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
        stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
      },
    };
  }

  setShowProfileBtn() {
    const payload = this.action.payload;

    return { ...this.state, showProfileBtn: payload };
  }

  setShowLeftBtn() {
    const payload = this.action.payload;

    return { ...this.state, showLeftBtn: payload };
  }

  setShowRightBtn() {
    const payload = this.action.payload;

    return { ...this.state, showRightBtn: payload };
  }

  setNavigationTitle() {
    const payload = this.action.payload;

    return { ...this.state, navigationTitle: payload };
  }

  resetNavigationTitle() {
    return { ...this.state, navigationTitle: 'Ứng lương 0% lãi' };
  }

  resetPaydayLoanInfo() {
    return {
      ...this.state,
      showStepProgressBar: false,
      showStepNavigation: false,
      showProfileBtn: false,
      showLeftBtn: false,
      showRightBtn: false,
      navigationTitle: 'Ứng lương 0% lãi',
      stepNavigationInfo: {
        currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
        lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
        stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
      },
      showNavigationBar: true,
    };
  }

  setShowNavigationBar() {
    const payload = this.action.payload;

    return { ...this.state, showNavigationBar: payload };
  }

  setSignContractTermsSuccess() {
    const payload = this.action.payload;

    return { ...this.state, signContractTermsSuccess: payload };
  }

  setSignContractSuccess() {
    const payload = this.action.payload;

    return { ...this.state, signContractSuccess: payload };
  }

  setSentOtpOnsignStatus() {
    const payload = this.action.payload;

    return { ...this.state, isSentOtpOnsign: payload };
  }

  setSignedContractTermStatus() {
    const payload = this.action.payload;

    return { ...this.state, isSignContractTermsStatus: payload };
  }

  setHasActiveLoanStatus() {
    const payload = this.action.payload;

    return { ...this.state, hasActiveLoan: payload };
  }

  setCurrentLoanCode() {
    const payload = this.action.payload;

    return { ...this.state, currentLoanCode: payload };
  }

  getActiveLoanInfo() {
    return { ...this.state };
  }

  getActiveLoanInfoSuccess() {
    return {
      ...this.state,
      hasActiveLoan: true,
    };
  }

  getActiveLoanInfoError() {
    return { ...this.state, hasActiveLoan: false };
  }

  setLoadingStatus() {
    const payload = this.action.payload;
    return {
      ...this.state,
      showLoading: payload.showLoading,
      loadingContent: payload.loadingContent,
    };
  }

  resetLoadingStatus() {
    const payload = this.action.payload;
    return {
      ...this.state,
      showLoading: false,
      loadingContent: {},
    };
  }
}

export function paydayLoanReducer(
  state: PaydayLoanState = PAYDAY_LOAN_INITIAL_STATE,
  action: fromActions.PaydayLoanActions
): PaydayLoanState {
  const paydayLoanActions: PaydayLoanActions = new PaydayLoanActions(
    state,
    action
  );

  switch (action.type) {
    case fromActions.SET_EKYC_INFO:
      return paydayLoanActions.setEkycInfo();
    case fromActions.RESET_EKYC_INFO:
      return paydayLoanActions.resetEkycInfo();
    case fromActions.SET_SHOW_STEP_PROGRESS_BAR:
      return paydayLoanActions.setShowStepProgressBar();
    case fromActions.SET_SHOW_STEP_NAVIGATION:
      return paydayLoanActions.setShowStepNavigation();
    case fromActions.SET_STEP_NAVIGATION_INFO:
      return paydayLoanActions.setStepNavigationInfo();
    case fromActions.RESET_STEP_NAVIGATION_INFO:
      return paydayLoanActions.resetStepNavigationInfo();
    case fromActions.SET_SHOW_PROFILE_BTN:
      return paydayLoanActions.setShowProfileBtn();
    case fromActions.SET_SHOW_LEFT_BTN:
      return paydayLoanActions.setShowLeftBtn();
    case fromActions.SET_SHOW_RIGHT_BTN:
      return paydayLoanActions.setShowRightBtn();
    case fromActions.SET_NAVIGATION_TITLE:
      return paydayLoanActions.setNavigationTitle();
    case fromActions.RESET_NAVIGATION_TITLE:
      return paydayLoanActions.resetNavigationTitle();
    case fromActions.RESET_PAYDAY_LOAN_INFO:
      return paydayLoanActions.resetPaydayLoanInfo();
    case fromActions.SET_SHOW_NAVIGATION_BAR:
      return paydayLoanActions.setShowNavigationBar();
    case fromActions.SET_SIGN_CONTRACT_SUCCESS:
      return paydayLoanActions.setSignContractSuccess();
    case fromActions.SET_SIGN_CONTRACT_TERMS_SUCCESS:
      return paydayLoanActions.setSignContractTermsSuccess();
    case fromActions.SET_SENT_OTP_ONSIGN_STATUS:
      return paydayLoanActions.setSentOtpOnsignStatus();
    case fromActions.SET_HAS_ACTIVE_LOAN_STATUS:
      return paydayLoanActions.setHasActiveLoanStatus();
    case fromActions.SET_CURRENT_LOAN_CODE:
      return paydayLoanActions.setCurrentLoanCode();
    case fromActions.GET_ACTIVE_LOAN_INFO:
      return paydayLoanActions.getActiveLoanInfo();
    case fromActions.GET_ACTIVE_LOAN_INFO_SUCCESS:
      return paydayLoanActions.getActiveLoanInfoSuccess();
    case fromActions.GET_ACTIVE_LOAN_INFO_ERROR:
      return paydayLoanActions.getActiveLoanInfoError();
    case fromActions.SET_IS_SIGN_CONTRACT_TERMS_STATUS:
      return paydayLoanActions.setSignedContractTermStatus();
    case fromActions.SET_LOADING_STATUS: {
      return paydayLoanActions.setLoadingStatus();
    }
    case fromActions.RESET_LOADING_STATUS: {
      return paydayLoanActions.resetLoadingStatus();
    }
    default: {
      return state;
    }
  }
}
