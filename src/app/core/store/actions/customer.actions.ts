import { Action } from '@ngrx/store';
import {LoanDeterminationModel} from "../../../public/models/loan-determination.model";

export const GET_CUSTOMER_INFO = '[Customer] get customer info';
export const GET_CUSTOMER_INFO_ERROR = '[Customer] get customer info error';
export const GET_CUSTOMER_INFO_SUCCESS = '[Customer] get customer info success';
export const SET_CUSTOMER_INFO = '[Customer] set customer info';
export const RESET_CUSTOMER_INFO = '[Customer] reset customer info';
export const GET_RATING_INFO = '[Customer] get rating info';
export const GET_RATING_INFO_SUCCESS = '[Customer] get rating info success';
export const GET_RATING_INFO_ERROR = '[Customer] get rating info error';
export const SET_RATING_INFO = '[Customer] set rating info';
export const RESET_RATING_INFO = '[Customer] reset rating info';
export const GET_LOAN_DETERMINATION = '[Customer] get loan determination';
export const SET_LOAN_DETERMINATION = '[Customer] set loan determination';
export const RESET_LOAN_DETERMINATION = '[Customer] reset loan determination';
export const GET_VIRTUAL_ACCOUNT_INFO = '[Customer] get virtual account info';
export const SET_VIRTUAL_ACCOUNT_INFO = '[Customer] set virtual account info';
export const RESET_VIRTUAL_ACCOUNT_INFO = '[Customer] reset virtual account info';

export class GetCustomerInfo implements Action {
  readonly type = GET_CUSTOMER_INFO;

  constructor(public payload: any) {}
}

export class GetCustomerInfoError implements Action {
  readonly type = GET_CUSTOMER_INFO_ERROR;

  constructor(public payload?: any) {}
}

export class GetCustomerInfoSuccess implements Action {
  readonly type = GET_CUSTOMER_INFO_SUCCESS;

  constructor(public payload: any) {}
}

export class SetCustomerInfo implements Action {
  readonly type = SET_CUSTOMER_INFO;

  constructor(public payload: any) {}
}

export class ResetCustomerInfo implements Action {
  readonly type = RESET_CUSTOMER_INFO;

  constructor(public payload?: any) {}
}

export class SetRatingInfo implements Action {
  readonly type = SET_RATING_INFO;

  constructor(public payload?: any) {}
}

export class GetRatingInfo implements Action {
  readonly type = GET_RATING_INFO;

  constructor(public payload?: any) {}
}

export class GetRatingInfoSuccess implements Action {
  readonly type = GET_RATING_INFO_SUCCESS;

  constructor(public payload?: any) {}
}

export class GetRatingInfoError implements Action {
  readonly type = GET_RATING_INFO_ERROR;

  constructor(public payload?: any) {}
}

export class ResetRatingInfo implements Action {
  readonly type = RESET_RATING_INFO;

  constructor(public payload?: any) {}
}

export class SetLoanDetermination implements Action {
  readonly type = SET_LOAN_DETERMINATION;

  constructor(public payload?: LoanDeterminationModel) {}
}

export class GetLoanDetermination implements Action {
  readonly type = GET_LOAN_DETERMINATION;

  constructor(public payload?: any) {}
}

export class ResetLoanDetermination implements Action {
  readonly type = RESET_LOAN_DETERMINATION;

  constructor(public payload?: any) {}
}

export class SetVirtualAccountInfo implements Action {
  readonly type = SET_VIRTUAL_ACCOUNT_INFO;

  constructor(public payload?: any) {}
}

export class GetVirtualAccountInfo implements Action {
  readonly type = GET_VIRTUAL_ACCOUNT_INFO;

  constructor(public payload?: any) {}
}

export class ResetVirtualAccountInfo implements Action {
  readonly type = RESET_VIRTUAL_ACCOUNT_INFO;

  constructor(public payload?: any) {}
}

export type CustomerActions =
  | GetCustomerInfoError
  | GetCustomerInfoSuccess
  | GetCustomerInfo
  | SetCustomerInfo
  | ResetCustomerInfo
  | SetRatingInfo
  | ResetRatingInfo
  | GetRatingInfo
  | GetRatingInfoSuccess
  | GetRatingInfoError
  | GetLoanDetermination
  | ResetLoanDetermination
  | SetLoanDetermination
  | GetVirtualAccountInfo
  | ResetVirtualAccountInfo
  | SetVirtualAccountInfo
;
