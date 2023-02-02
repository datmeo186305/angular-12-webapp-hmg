import { PersonalData } from './../../../../../open-api-modules/customer-api-docs/model/personalData';
import { APPLICATION_TYPE } from './../../common/enum/payday-loan';
import { CustomerInfoResponse } from './../../../../../open-api-modules/customer-api-docs/model/customerInfoResponse';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as fromActions from '../actions';
import {
  ApiResponseCustomerInfoResponse,
  ApiResponseRating,
  CreateRatingRequest,
  InfoControllerService,
  RatingControllerService,
} from '../../../../../open-api-modules/customer-api-docs';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class CustomerEffects {
  customerId$: Observable<any>;
  customerId: string;
  customerInfo: CustomerInfoResponse;
  applicationType: APPLICATION_TYPE = APPLICATION_TYPE.PDL_TNG;
  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private infoControllerService: InfoControllerService,
    private ratingControllerService: RatingControllerService
  ) {
    this.customerId$ = store$.select(fromStore.getCustomerIdState);
    this.subManager.add(
      this.customerId$.subscribe((customer_id) => {
        this.customerId = customer_id;
      })
    );
  }

  getCustomerInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GET_CUSTOMER_INFO),
      map((action: fromActions.GetCustomerInfo) => action.payload),
      switchMap((customerId: string) => {
        return this.infoControllerService.getInfo().pipe(
          map((response: ApiResponseCustomerInfoResponse) => {
            console.log('Effect Response:', response);
            if (!response || response.responseCode !== 200) {
              return new fromActions.GetCustomerInfoError(response.errorCode);
            }
            this.customerInfo = response.result;
            return new fromActions.GetCustomerInfoSuccess(response.result);
          }),
          catchError((error) => of(new fromActions.GetCustomerInfoError(error)))
        );
      })
    )
  );

  getCustomerInfoSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.GET_CUSTOMER_INFO_SUCCESS),
        map((action: fromActions.GetCustomerInfoSuccess) => action.payload),
        tap((response: ApiResponseCustomerInfoResponse) => {
          this.store$.dispatch(new fromStore.GetRatingInfo());
          this.store$.dispatch(new fromStore.GetActiveLoanInfo());
        })
      ),
    { dispatch: false }
  );

  getRatingInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.GET_RATING_INFO),
      switchMap(() => {
        switch (this.customerInfo?.personalData?.companyGroupName) {
          case 'TNG':
            this.applicationType = APPLICATION_TYPE.PDL_TNG;
            return this.getLastRating();
          case 'HMG':
            this.applicationType = APPLICATION_TYPE.PDL_HMG;
            return this.getLastRating();
          case 'VAC':
            this.applicationType =
              this.customerInfo.personalData.employeeType ===
              PersonalData.EmployeeTypeEnum.Factory
                ? (this.applicationType = APPLICATION_TYPE.PDL_VAC_FACTORY)
                : (this.applicationType = APPLICATION_TYPE.PDL_VAC_OFFICE);
            return this.getLastRating();
          default:
            this.applicationType = APPLICATION_TYPE.PDL_TNG;
            return this.getLastRating();
        }
      })
    )
  );

  getLastRating() {
    return this.ratingControllerService
      .getLastRating(this.applicationType, false)
      .pipe(
        map((response: ApiResponseRating) => {
          console.log('Effect Response:', response);
          if (!response || response.responseCode !== 200) {
            return new fromActions.GetRatingInfoError();
          }
          return new fromActions.GetRatingInfoSuccess(response.result);
        }),
        catchError((error) => of(new fromActions.GetRatingInfoError(error)))
      );
  }
}
