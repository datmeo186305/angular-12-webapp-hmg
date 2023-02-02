import {
  CustomerInfoResponse,
  Rating,
} from '../../../../../open-api-modules/customer-api-docs';
import * as fromActions from '../actions';
import { HttpErrorResponse } from '@angular/common/http';
import {LoanDeterminationModel} from "../../../public/models/loan-determination.model";
import {VirtualAccount} from "../../../../../open-api-modules/payment-api-docs";

export interface CustomerState {
  customerInfo: CustomerInfoResponse;
  getCustomerError: HttpErrorResponse;
  rateInfo: Rating;
  loanDetermination?: LoanDeterminationModel;
  virtualAccountInfo?: VirtualAccount
}

export const CUSTOMER_INITIAL_STATE: CustomerState = {
  customerInfo: null,
  getCustomerError: null,
  rateInfo: null,
  loanDetermination: null,
  virtualAccountInfo: null,
};

class CustomerActions {
  constructor(
    private state: CustomerState,
    private action: fromActions.CustomerActions
  ) {}

  getCustomerInfo() {
    const payload = this.action.payload;

    return { ...this.state };
  }

  setCustomerInfo() {
    const payload = this.action.payload;

    return { ...this.state, customerInfo: payload };
  }

  resetCustomerInfo() {
    return { ...this.state, customerInfo: null };
  }

  getCustomerInfoSuccess() {
    const payload = this.action.payload;

    if (!payload || !payload.responseCode || payload.responseCode !== 200)
      return this.state;
    return {
      ...this.state,
      customerInfo: payload.result,
      getCustomerError: null,
    };
  }

  getCustomerInfoError() {
    const payload = this.action.payload;
    return { ...this.state, getCustomerError: payload };
  }

  setRatingInfo() {
    const payload = this.action.payload;
    return { ...this.state, rateInfo: payload };
  }

  resetRatingInfo() {
    return { ...this.state, rateInfo: null };
  }

  getRatingInfo() {
    return { ...this.state };
  }

  getLoanDetermination() {
    return { ...this.state };
  }

  setLoanDetermination() {
    const payload = this.action.payload;
    return { ...this.state, loanDetermination: payload };
  }

  resetLoanDetermination() {
    return { ...this.state, loanDetermination: null };
  }

  getVirtualAccountInfo() {
    return { ...this.state};
  }

  setVirtualAccountInfo() {
    const payload = this.action.payload;
    return { ...this.state, virtualAccountInfo: payload };
  }

  resetVirtualAccountInfo() {
    return { ...this.state, virtualAccountInfo: null };
  }
}

export function customerReducer(
  state: CustomerState = CUSTOMER_INITIAL_STATE,
  action: fromActions.CustomerActions
): CustomerState {
  const customerActions: CustomerActions = new CustomerActions(state, action);

  switch (action.type) {
    case fromActions.GET_CUSTOMER_INFO: {
      return customerActions.getCustomerInfo();
    }

    case fromActions.GET_CUSTOMER_INFO_SUCCESS: {
      return customerActions.getCustomerInfoSuccess();
    }

    case fromActions.GET_CUSTOMER_INFO_ERROR: {
      return customerActions.getCustomerInfoError();
    }

    case fromActions.SET_CUSTOMER_INFO: {
      return customerActions.setCustomerInfo();
    }

    case fromActions.RESET_CUSTOMER_INFO: {
      return customerActions.resetCustomerInfo();
    }

    case fromActions.SET_RATING_INFO: {
      return customerActions.setRatingInfo();
    }

    case fromActions.RESET_RATING_INFO: {
      return customerActions.resetRatingInfo();
    }

    case fromActions.GET_RATING_INFO: {
      return customerActions.getRatingInfo();
    }

    case fromActions.GET_RATING_INFO_SUCCESS: {
      return customerActions.setRatingInfo();
    }

    case fromActions.GET_RATING_INFO_ERROR: {
      return customerActions.resetRatingInfo();
    }

    case fromActions.SET_LOAN_DETERMINATION: {
      return customerActions.setLoanDetermination();
    }

    case fromActions.RESET_LOAN_DETERMINATION: {
      return customerActions.resetLoanDetermination();
    }

    case fromActions.GET_LOAN_DETERMINATION: {
      return customerActions.getLoanDetermination();
    }

    case fromActions.SET_VIRTUAL_ACCOUNT_INFO: {
      return customerActions.setVirtualAccountInfo();
    }

    case fromActions.RESET_VIRTUAL_ACCOUNT_INFO: {
      return customerActions.resetVirtualAccountInfo();
    }

    case fromActions.GET_VIRTUAL_ACCOUNT_INFO: {
      return customerActions.getVirtualAccountInfo();
    }

    default: {
      return state;
    }
  }
}
