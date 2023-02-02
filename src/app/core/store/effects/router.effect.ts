import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RouterActions from '../actions/router.actions';

import { map, tap } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import * as fromSelectors from '../selectors';
import { Observable } from 'rxjs/Observable';
import * as fromActions from '../actions';
import formatSlug from '../../utils/format-slug';
import { PAYDAY_LOAN_STATUS } from '../../common/enum/payday-loan';

@Injectable()
export class RouterEffects {
  isSentOtpOnsign$: Observable<boolean>;
  isSentOtpOnsign: boolean;

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private store$: Store<fromStore.State>
  ) {
    this.isSentOtpOnsign$ = this.store$.select(fromSelectors.isSentOtpOnsign);
    this.isSentOtpOnsign$.subscribe((isSentOtpOnsign) => {
      this.isSentOtpOnsign = isSentOtpOnsign;
    });
  }

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.GO),
        map((action: RouterActions.Go) => action.payload),
        tap(({ path, query: queryParams, extras }) => {
          this.router.navigate(path, { queryParams, ...extras });
        })
      ),
    { dispatch: false }
  );

  navigateBack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.BACK),
        tap(() => this.location.back())
      ),
    { dispatch: false }
  );

  navigateForward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.FORWARD),
        tap(() => this.location.forward())
      ),
    { dispatch: false }
  );

  navigateClickToBackBtn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.CLICK_BACK_BTN),
        tap(() => {
          switch (this.router.url) {
            case '/auth/sign-in': {
              this.router.navigateByUrl('/');
              break;
            }
            case '/auth/sign-up': {
              this.router.navigateByUrl('/auth/sign-in');
              break;
            }
            case '/auth/forgot-password': {
              this.router.navigateByUrl('/auth/sign-in');
              break;
            }
            case '/hmg/additional-information': {
              this.router.navigateByUrl('/hmg/confirm-information');
              break;
            }
            case '/vac/additional-information': {
              this.router.navigateByUrl('/vac/confirm-information');
              break;
            }
            case '/hmg/sign-approval-letter': {
              if (this.isSentOtpOnsign) {
                return this.store$.dispatch(
                  new fromActions.SetSentOtpOnsignStatus(false)
                );
              }
              this.router.navigateByUrl('/hmg/additional-information');
              break;
            }
            case '/vac/sign-approval-letter': {
              if (this.isSentOtpOnsign) {
                return this.store$.dispatch(
                  new fromActions.SetSentOtpOnsignStatus(false)
                );
              }
              this.router.navigateByUrl('/vac/loan-determination');
              break;
            }

            case '/hmg/sign-contract': {
              if (this.isSentOtpOnsign) {
                return this.store$.dispatch(
                  new fromActions.SetSentOtpOnsignStatus(false)
                );
              }
              this.router.navigate([
                '/hmg/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
              break;
            }

            case '/vac/sign-contract': {
              if (this.isSentOtpOnsign) {
                return this.store$.dispatch(
                  new fromActions.SetSentOtpOnsignStatus(false)
                );
              }
              this.router.navigate([
                '/vac/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
              break;
            }
            case '/hmg/loan-payment': {
              this.router.navigate([
                '/hmg/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
              break;
            }
            case '/vac/loan-payment': {
              this.router.navigate([
                '/vac/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
              break;
            }
            case '/vac/loan-step-payment': {
              this.router.navigate([
                '/vac/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
              break;
            }
            case '/tng/loan-payment': {
              this.router.navigate([
                '/tng/current-loan',
                formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
              break;
            }
            case '/hmg/choose-payment-method':
              this.router.navigateByUrl('/hmg/loan-payment');
              break;
            case '/tng/choose-payment-method':
              this.router.navigateByUrl('/tng/loan-payment');
              break;
            case '/vac/choose-payment-method':
              this.router.navigateByUrl('/vac/loan-payment');
              break;
            default:
              break;
          }
        })
      ),
    { dispatch: false }
  );
}
