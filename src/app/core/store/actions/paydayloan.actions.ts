import { Action } from '@ngrx/store';
import { IdCardInfo } from '../../../../../open-api-modules/customer-api-docs';
import { PL_STEP_NAVIGATION } from '../../common/enum/payday-loan';

export const SET_EKYC_INFO = '[EKYC] Set ekyc info';
export const RESET_EKYC_INFO = '[EKYC] Reset ekyc info';
export const SET_SHOW_STEP_PROGRESS_BAR = '[Header] Set show step progress bar';
export const SET_SHOW_STEP_NAVIGATION = '[Header] Set show step navigation';
export const SET_STEP_NAVIGATION_INFO = '[Header] Set step navigation info';
export const RESET_STEP_NAVIGATION_INFO = '[Header] Reset step navigation info';
export const SET_SHOW_PROFILE_BTN = '[Header] Set show profile btn';
export const SET_SHOW_LEFT_BTN = '[Header] Set show left btn';
export const SET_SHOW_RIGHT_BTN = '[Header] Set show right btn';
export const SET_NAVIGATION_TITLE = '[Header] Set navigation title';
export const RESET_NAVIGATION_TITLE = '[Header] Reset navigation title';
export const SET_SHOW_NAVIGATION_BAR = '[Header] Set show navigation bar';
export const RESET_PAYDAY_LOAN_INFO = '[PaydayLoan] Reset payday loan info';
export const SET_SIGN_CONTRACT_TERMS_SUCCESS =
  '[PaydayLoan] Set sign contract term success';
export const SET_SIGN_CONTRACT_SUCCESS =
  '[PaydayLoan] Set sign contract success';
export const SET_SENT_OTP_ONSIGN_STATUS = '[PaydayLoan] Set sent otp status';
export const SET_HAS_ACTIVE_LOAN_STATUS =
  '[PaydayLoan] Set has active loan status';
export const SET_CURRENT_LOAN_CODE = '[PaydayLoan] Set current loan code';
export const GET_ACTIVE_LOAN_INFO = '[PaydayLoan] Get active loan';
export const GET_ACTIVE_LOAN_INFO_SUCCESS =
  '[PaydayLoan] Get active loan success';
export const GET_ACTIVE_LOAN_INFO_ERROR = '[PaydayLoan] Get active loan error';
export const SET_IS_SIGN_CONTRACT_TERMS_STATUS = '[PaydayLoan] Set is sign contract terms status';
export const SET_LOADING_STATUS = '[PaydayLoan] set show loading status';
export const RESET_LOADING_STATUS = '[PaydayLoan] reset show loading status';


export class SetEkycInfo implements Action {
  readonly type = SET_EKYC_INFO;

  constructor(public payload: IdCardInfo) {}
}

export class ResetEkycInfo implements Action {
  readonly type = RESET_EKYC_INFO;

  constructor(public payload?: any) {}
}

export class SetShowStepProgressBar implements Action {
  readonly type = SET_SHOW_STEP_PROGRESS_BAR;

  constructor(public payload: boolean) {}
}

export class SetShowStepNavigation implements Action {
  readonly type = SET_SHOW_STEP_NAVIGATION;

  constructor(public payload: boolean) {}
}

export class SetStepNavigationInfo implements Action {
  readonly type = SET_STEP_NAVIGATION_INFO;

  constructor(public payload: PL_STEP_NAVIGATION) {}
}

export class ResetStepNavigationInfo implements Action {
  readonly type = RESET_STEP_NAVIGATION_INFO;

  constructor(public payload: any) {}
}

export class SetShowProfileBtn implements Action {
  readonly type = SET_SHOW_PROFILE_BTN;

  constructor(public payload: boolean) {}
}

export class SetShowLeftBtn implements Action {
  readonly type = SET_SHOW_LEFT_BTN;

  constructor(public payload: boolean) {}
}

export class SetShowRightBtn implements Action {
  readonly type = SET_SHOW_RIGHT_BTN;

  constructor(public payload: boolean) {}
}

export class SetNavigationTitle implements Action {
  readonly type = SET_NAVIGATION_TITLE;

  constructor(public payload: string) {}
}

export class ResetNavigationTitle implements Action {
  readonly type = RESET_NAVIGATION_TITLE;

  constructor(public payload?: string) {}
}

export class ResetPaydayLoanInfo implements Action {
  readonly type = RESET_PAYDAY_LOAN_INFO;

  constructor(public payload?: any) {}
}

export class SetShowNavigationBar implements Action {
  readonly type = SET_SHOW_NAVIGATION_BAR;

  constructor(public payload: boolean) {}
}

export class SetSignContractSuccess implements Action {
  readonly type = SET_SIGN_CONTRACT_SUCCESS;

  constructor(public payload: boolean) {}
}

export class SetSignContractTermsSuccess implements Action {
  readonly type = SET_SIGN_CONTRACT_TERMS_SUCCESS;

  constructor(public payload: boolean) {}
}

export class SetSentOtpOnsignStatus implements Action {
  readonly type = SET_SENT_OTP_ONSIGN_STATUS;

  constructor(public payload: boolean) {}
}

export class SetHasActiveLoanStatus implements Action {
  readonly type = SET_HAS_ACTIVE_LOAN_STATUS;

  constructor(public payload: boolean) {}
}

export class SetCurrentLoanCode implements Action {
  readonly type = SET_CURRENT_LOAN_CODE;

  constructor(public payload: string) {}
}

export class GetActiveLoanInfo implements Action {
  readonly type = GET_ACTIVE_LOAN_INFO;

  constructor(public payload?: any) {}
}

export class GetActiveLoanInfoSuccess implements Action {
  readonly type = GET_ACTIVE_LOAN_INFO_SUCCESS;

  constructor(public payload: any) {}
}

export class GetActiveLoanInfoError implements Action {
  readonly type = GET_ACTIVE_LOAN_INFO_ERROR;

  constructor(public payload: any) {}
}

export class SetIsSignContractTermsStatus implements Action {
  readonly type = SET_IS_SIGN_CONTRACT_TERMS_STATUS;

  constructor(public payload: boolean) {}
}

export class SetLoadingStatus implements Action {
  readonly type = SET_LOADING_STATUS;

  constructor(public payload: any) {}
}

export class ResetLoadingStatus implements Action {
  readonly type = RESET_LOADING_STATUS;

  constructor(public payload?: any) {}
}

export type PaydayLoanActions =
  | SetEkycInfo
  | ResetEkycInfo
  | SetShowStepProgressBar
  | SetShowStepNavigation
  | SetShowProfileBtn
  | SetShowLeftBtn
  | SetShowRightBtn
  | SetNavigationTitle
  | ResetNavigationTitle
  | SetStepNavigationInfo
  | ResetStepNavigationInfo
  | ResetPaydayLoanInfo
  | SetShowNavigationBar
  | SetSignContractSuccess
  | SetSignContractTermsSuccess
  | SetSentOtpOnsignStatus
  | SetHasActiveLoanStatus
  | SetCurrentLoanCode
  | GetActiveLoanInfo
  | GetActiveLoanInfoSuccess
  | GetActiveLoanInfoError
  | SetIsSignContractTermsStatus
  | SetLoadingStatus
  | ResetLoadingStatus;
