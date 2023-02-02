import { PersonalData } from './../../../../../open-api-modules/customer-api-docs/model/personalData';
import {APPLICATION_TYPE, COMPANY_NAME} from './../../common/enum/payday-loan';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as fromActions from '../actions';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import {
  ApiResponsePaydayLoan,
  ApiResponsePaydayLoan as TngApiResponsePaydayLoan,
  ApplicationControllerService as TngApplicationControllerService, MifosPaydayLoanControllerService,
} from '../../../../../open-api-modules/loanapp-tng-api-docs';
import { CustomerInfoResponse } from 'open-api-modules/customer-api-docs';
import { environment } from 'src/environments/environment';

@Injectable()
export class PaydayloanEffects {
  customerId$: Observable<string>;
  customerId: string;

  public customerInfo$: Observable<any>;
  customerInfo: CustomerInfoResponse;

  coreToken$: Observable<string>;
  coreToken: string;

  applicationType: string;

  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private mifosPaydayLoanControllerService: MifosPaydayLoanControllerService,
    private tngApplicationControllerService: TngApplicationControllerService
  ) {
    this.customerId$ = store$.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((customer_id) => {
        this.customerId = customer_id;
      })
    );

    this.customerInfo$ = store$.select(fromStore.getCustomerInfoState);
    this.subManager.add(
      this.customerInfo$.subscribe((customerInfo) => {
        this.customerInfo = customerInfo;
      })
    );

    this.coreToken$ = store$.select(fromStore.getCoreTokenState);
    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );
  }

  getActiveLoanInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GET_ACTIVE_LOAN_INFO),
      map((action: fromActions.GetActiveLoanInfo) => action.payload),
      switchMap((payload: any) => {
        if (!this.coreToken || !this.customerId) {
          return null;
        }
        switch (this.customerInfo.personalData?.companyGroupName) {
          case COMPANY_NAME.HMG:
            return this.getActiveLoanHmg();
          case COMPANY_NAME.TNG:
            this.applicationType = APPLICATION_TYPE.PDL_TNG;
            return this.getActiveLoan();

          case COMPANY_NAME.VAC:
            this.customerInfo.personalData.employeeType ===
            PersonalData.EmployeeTypeEnum.Office
              ? (this.applicationType = APPLICATION_TYPE.PDL_VAC_OFFICE)
              : (this.applicationType = APPLICATION_TYPE.PDL_VAC_FACTORY);
            return this.getActiveLoan()
          default:
            return Observable.of<any>()
        }
      })
    )
  );

  getActiveLoan() {
    return this.tngApplicationControllerService
      .getActivePaydayLoan(this.coreToken, this.applicationType)
      .pipe(
        map((response: TngApiResponsePaydayLoan) => {
          if (!response || response.responseCode !== 200) {
            return new fromActions.GetActiveLoanInfoError(response.errorCode);
          }
          return new fromActions.GetActiveLoanInfoSuccess(response.result);
        }),
        catchError((error) => of(new fromActions.GetActiveLoanInfoError(error)))
      );
  }

  getActiveLoanHmg() {
    return this.mifosPaydayLoanControllerService.getActivePaydayLoanMifos(this.customerId, APPLICATION_TYPE.PDL_HMG).pipe(
      map((response: ApiResponsePaydayLoan) => {
        console.log('Effect Response:', response);
        if (!response || response.responseCode !== 200) {
          return new fromActions.GetActiveLoanInfoError(response.errorCode);
        }
        return new fromActions.GetActiveLoanInfoSuccess(response.result);
      }),
      catchError((error) => of(new fromActions.GetActiveLoanInfoError(error)))
    );
  }
}
