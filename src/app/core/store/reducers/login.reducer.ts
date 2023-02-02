import * as actions from '../actions';
import { Auth } from '../../../public/models';
import { HttpErrorResponse } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Token } from '../../../public/models/token.model';

export interface LoginState {
  authorization: Auth;
  loginProcess: string;
  loginError: HttpErrorResponse;
  coreToken: string;
  password: string;
  customerMobile: string;
}

export const LOGIN_INITIAL_STATE: LoginState = {
  authorization: null,
  loginProcess: null,
  loginError: null,
  coreToken: null,
  password: null,
  customerMobile: null,
};

class LoginActions {
  constructor(
    private state: LoginState,
    private action: actions.LoginActions
  ) {}

  signin() {
    const payload = this.action.payload;
    return {
      ...this.state,
      loginProcess: 'Proccess login...',
      customerMobile: payload.username,
      password: payload.password,
    };
  }

  success() {
    if (
      !this.action.payload ||
      !this.action.payload.responseCode ||
      this.action.payload.responseCode !== 200
    )
      return this.state;
    const decodedResult: Token = jwt_decode(
      this.action.payload.result?.accessToken
    );
    const payload: Auth = {
      token: this.action.payload.result?.accessToken,
      exp: decodedResult.exp,
      customerId: decodedResult.sub,
      authorities: decodedResult.authorities,
    };
    return {
      ...this.state,
      authorization: payload,
      loginProcess: 'Login success',
      loginError: null,
    };
  }

  error() {
    const payload = this.action.payload;
    return { ...this.state, loginError: payload, loginProcess: 'Login failed' };
  }

  logout() {
    return {
      ...this.state,
      authorization: null,
      loginProcess: null,
      loginError: null,
      coreToken: null,
      password: null,
    };
  }

  signinCore() {
    return { ...this.state, loginProcess: 'Proccess login core...' };
  }

  signinCoreError() {
    const payload = this.action.payload;
    return {
      ...this.state,
      loginError: payload,
      loginProcess: 'Login core failed',
    };
  }

  signinCoreSuccess() {
    const payload = this.action.payload;

    if (!payload || !payload.code || payload.code !== 200) return this.state;

    return {
      ...this.state,
      coreToken: payload.result?.access_token,
      loginProcess: 'Login core success',
    };
  }

  setCustomerMobile() {
    const payload = this.action.payload;

    return {
      ...this.state,
      customerMobile: payload,
    };
  }

  setCoreToken() {
    const payload = this.action.payload;

    return {
      ...this.state,
      coreToken: payload,
    };
  }
}

export function loginReducer(
  state: LoginState = LOGIN_INITIAL_STATE,
  action: actions.LoginActions
): LoginState {
  const loginActions: LoginActions = new LoginActions(state, action);

  switch (action.type) {
    case actions.LOGIN_SIGNIN: {
      return loginActions.signin();
    }

    case actions.LOGIN_SIGNIN_SUCCESS: {
      return loginActions.success();
    }

    case actions.LOGIN_SIGNIN_ERROR: {
      return loginActions.error();
    }

    case actions.LOGIN_SIGN_OUT: {
      return loginActions.logout();
    }

    case actions.LOGIN_SIGNIN_CORE: {
      return loginActions.signinCore();
    }

    case actions.LOGIN_SIGNIN_CORE_SUCCESS: {
      return loginActions.signinCoreSuccess();
    }

    case actions.LOGIN_SIGNIN_CORE_ERROR: {
      return loginActions.signinCoreError();
    }

    case actions.SET_CUSTOMER_MOBILE: {
      return loginActions.setCustomerMobile();
    }

    case actions.SET_CORE_TOKEN: {
      return loginActions.setCoreToken();
    }

    default: {
      return state;
    }
  }
}
