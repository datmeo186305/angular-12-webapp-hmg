import { Action } from '@ngrx/store';
import { LoginForm } from '../../../public/models';

export const LOGIN_SIGNIN = '[Login] signin';
export const LOGIN_SIGNIN_ERROR = '[Login] signin error';
export const LOGIN_SIGNIN_SUCCESS = '[Login] signin success';
export const LOGIN_SIGN_OUT = '[Logout] logout';
export const LOGIN_SIGNIN_CORE = '[LoginCore] signin core';
export const LOGIN_SIGNIN_CORE_SUCCESS = '[LoginCore] signin core success';
export const LOGIN_SIGNIN_CORE_ERROR = '[LoginCore] signin core error';
export const SET_CUSTOMER_MOBILE = '[Login] Set customer mobile';
export const SET_CORE_TOKEN = '[Login] Set core token';

export class Signin implements Action {
  readonly type = LOGIN_SIGNIN;

  constructor(public payload: LoginForm) {}
}

export class Logout implements Action {
  readonly type = LOGIN_SIGN_OUT;

  constructor(public payload?: any) {}
}

export class SigninError implements Action {
  readonly type = LOGIN_SIGNIN_ERROR;

  constructor(public payload: any) {}
}

export class SigninSuccess implements Action {
  readonly type = LOGIN_SIGNIN_SUCCESS;

  constructor(public payload: any) {}
}

export class SigninCore implements Action {
  readonly type = LOGIN_SIGNIN_CORE;

  constructor(public payload: LoginForm) {}
}

export class SigninCoreSuccess implements Action {
  readonly type = LOGIN_SIGNIN_CORE_SUCCESS;

  constructor(public payload: any) {}
}

export class SigninCoreError implements Action {
  readonly type = LOGIN_SIGNIN_CORE_ERROR;

  constructor(public payload: any) {}
}

export class SetCustomerMobile implements Action {
  readonly type = SET_CUSTOMER_MOBILE;

  constructor(public payload: string) {}
}

export class SetCoreToken implements Action {
  readonly type = SET_CORE_TOKEN;

  constructor(public payload: string) {}
}

export type LoginActions =
  | SigninError
  | SigninSuccess
  | Logout
  | Signin
  | SigninCoreSuccess
  | SigninCore
  | SigninCoreError
  | SetCustomerMobile
  | SetCoreToken;
