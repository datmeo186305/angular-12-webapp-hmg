import { PersonalData } from './../../../../../open-api-modules/customer-api-docs/model/personalData';
import { APPLICATION_TYPE } from './../../common/enum/payday-loan';
import { RatingControllerService } from '../../../../../open-api-modules/customer-api-docs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import * as fromActions from '../actions';
import { LoginForm } from '../../../public/models';
import {
  ApiResponseLoginResponse,
  SignOnControllerService, SignOnMifosControllerService,
} from '../../../../../open-api-modules/identity-api-docs';
import * as Sentry from '@sentry/angular';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import {
  LoginControllerService,
  LoginInput,
} from 'open-api-modules/core-api-docs';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService, MifosPaydayLoanControllerService,
} from '../../../../../open-api-modules/loanapp-tng-api-docs';
import {
  ApiResponsePaydayLoan as TngApiResponsePaydayLoan,
  ApplicationControllerService as TngApplicationControllerService,
} from '../../../../../open-api-modules/loanapp-tng-api-docs';
import { Store } from '@ngrx/store';
import * as fromStore from '../index';
import { Observable, Subscription } from 'rxjs';
import formatSlug from './../../../core/utils/format-slug';
import {
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
} from '../../common/enum/payday-loan';
import { NotificationService } from '../../services/notification.service';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoginEffects {
  loginInput: LoginInput;
  loginPayload: any;

  public coreToken$: Observable<any>;
  coreToken: string;

  public customerId$: Observable<any>;
  customerId: string;

  public customerInfo$: Observable<any>;
  customerInfo: CustomerInfoResponse;

  applicationType: string;

  subManager = new Subscription();

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private router: Router,
    private location: Location,
    private signOnService: SignOnMifosControllerService,
    private infoService: InfoControllerService,
    private loginService: LoginControllerService,
    private applicationControllerService: ApplicationControllerService,
    private mifosPaydayLoanControllerService: MifosPaydayLoanControllerService,
    private tngApplicationControllerService: TngApplicationControllerService,
    private ratingControllerService: RatingControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.coreToken$ = store$.select(fromStore.getCoreTokenState);
    this.subManager.add(
      this.coreToken$.subscribe((token) => {
        this.coreToken = token;
      })
    );

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
  }

  logoutSignOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGN_OUT),
        tap(() => {
          this.notificationService.destroyAllDialog();
          this.store$.dispatch(new fromActions.ResetCustomerInfo());
          this.store$.dispatch(new fromActions.SetShowProfileBtn(false));
          this.store$.dispatch(new fromActions.SetSentOtpOnsignStatus(false));
          this.store$.dispatch(
            new fromActions.SetSignContractTermsSuccess(false)
          );
          this.store$.dispatch(new fromActions.SetSignContractSuccess(false));
          this.store$.dispatch(new fromActions.SetHasActiveLoanStatus(false));
          this.store$.dispatch(new fromActions.SetCurrentLoanCode(null));
          this.store$.dispatch(new fromActions.ResetEkycInfo(null));
          this.store$.dispatch(new fromActions.ResetRatingInfo());
          this.store$.dispatch(
            new fromActions.SetIsSignContractTermsStatus(false)
          );
          Sentry.configureScope((scope) => scope.setUser(null));
        })
      ),
    { dispatch: false }
  );

  loginSingin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LOGIN_SIGNIN),
      map((action: fromActions.Signin) => action.payload),
      switchMap((login: LoginForm) => {
        const { username, password } = login;

        return this.signOnService
          .mobileLoginMifos({
            mobile: username,
            password: password,
          })
          .pipe(
            map((result: ApiResponseLoginResponse) => {
              //
              this.loginInput = login;
              this.loginPayload = result;
              if (!result || result.responseCode !== 200) {
                return new fromActions.SigninError(result.errorCode);
              }
              return new fromActions.SigninSuccess(result);
            })
          );
      })
    )
  );

  loginSinginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_SUCCESS),
        tap(() => {
          this.subManager.add(
            this.infoService
              .getInfo()
              .subscribe((result: ApiResponseCustomerInfoResponse) => {
                if (!result || result.responseCode !== 200) return;

                this.store$.dispatch(
                  new fromActions.SetCustomerInfo(result.result)
                );

                this.store$.dispatch(new fromActions.GetRatingInfo());

                Sentry.setUser({
                  id: this.loginPayload.result.customerId,
                  username: result.result.personalData?.mobileNumber,
                  email: result.result.personalData?.emailAddress,
                  ip_address: '',
                });

                // if (result.result.personalData.stepOne === 'DONE') {
                //   this.store$.dispatch(
                //     new fromActions.SigninCore(this.loginInput)
                //   );
                //   return;
                // }

                this._redirectToNextPage();
              })
          );
        })
      ),
    { dispatch: false }
  );

  loginSigninError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_ERROR),
        map((action: fromActions.SigninError) => action.payload),
        tap((errorCode: any) => {
          this.notificationService.openErrorModal({
            title: this.multiLanguageService.instant('common.notification'),
            content: errorCode
              ? this.multiLanguageService.instant(ERROR_CODE_KEY[errorCode])
              : this.multiLanguageService.instant(
                  'common.something_went_wrong'
                ),
            primaryBtnText: this.multiLanguageService.instant('common.confirm'),
          });
        })
      ),
    { dispatch: false }
  );

  loginSinginCore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.LOGIN_SIGNIN_CORE),
      map((action: fromActions.SigninCore) => action.payload),
      switchMap((login: LoginForm) => {
        const { username, password } = login;
        return this.loginService
          .login({
            username: username,
            password: password,
          })
          .pipe(
            map((result) => {
              const coreResponse = JSON.parse(JSON.stringify(result));
              if (!coreResponse || coreResponse.code !== 200) {
                return new fromActions.SigninCoreError(coreResponse.message);
              }
              return new fromActions.SigninCoreSuccess(coreResponse);
            })
          );
      })
    )
  );

  loginSinginCoreSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_CORE_SUCCESS),
        tap(() => {
          //HMG
          if (this.customerInfo.personalData?.companyGroupName === 'HMG') {
            this.subManager.add(
              this.mifosPaydayLoanControllerService
                .getActivePaydayLoanMifos(this.customerId, APPLICATION_TYPE.PDL_HMG)
                .subscribe((result: ApiResponsePaydayLoan) => {
                  if (!result || result.responseCode !== 200) {
                    return this._redirectToNextPage();
                  }

                  this.store$.dispatch(
                    new fromActions.SetHasActiveLoanStatus(true)
                  );

                  return this.router.navigate([
                    '/hmg/current-loan',
                    formatSlug(
                      result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
                    ),
                  ]);
                })
            );
          }

          //Other
          switch (this.customerInfo.personalData?.companyGroupName) {
            case 'TNG':
              this.applicationType = APPLICATION_TYPE.PDL_TNG;
              this.subManager.add(
                this.tngApplicationControllerService
                  .getActivePaydayLoan(this.coreToken, this.applicationType)
                  .subscribe((result: TngApiResponsePaydayLoan) => {
                    if (!result || result.responseCode !== 200) {
                      return this._redirectToNextPage();
                    }

                    this.store$.dispatch(
                      new fromActions.SetHasActiveLoanStatus(true)
                    );

                    return this.router.navigate([
                      '/tng/current-loan',
                      formatSlug(
                        result.result.status ||
                          PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
                      ),
                    ]);
                  })
              );
              break;

            case 'VAC':
              this.applicationType =
                this.customerInfo.personalData.employeeType ===
                PersonalData.EmployeeTypeEnum.Factory
                  ? (this.applicationType = APPLICATION_TYPE.PDL_VAC_FACTORY)
                  : (this.applicationType = APPLICATION_TYPE.PDL_VAC_OFFICE);

              this.subManager.add(
                this.tngApplicationControllerService
                  .getActivePaydayLoan(this.coreToken, this.applicationType)
                  .subscribe((result: TngApiResponsePaydayLoan) => {
                    if (!result || result.responseCode !== 200) {
                      return this._redirectToNextPage();
                    }

                    this.store$.dispatch(
                      new fromActions.SetHasActiveLoanStatus(true)
                    );

                    return this.router.navigate([
                      `/${this.customerInfo.personalData.companyGroupName.toLowerCase()}/current-loan`,
                      formatSlug(
                        result.result.status ||
                          PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
                      ),
                    ]);
                  })
              );
              break;

            default:
              return this._redirectToNextPage();
          }
        })
      ),
    { dispatch: false }
  );

  loginSinginCoreError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.LOGIN_SIGNIN_CORE_ERROR),
        tap(() => {
          this.store$.dispatch(new fromActions.ResetCustomerInfo());
          this.store$.dispatch(new fromActions.Logout());
          setTimeout(() => {
            this.notificationService.openErrorModal({
              title: this.multiLanguageService.instant('common.notification'),
              content: this.multiLanguageService.instant(
                'common.something_went_wrong'
              ),
              primaryBtnText:
                this.multiLanguageService.instant('common.confirm'),
            });
          }, 500);
        })
      ),
    { dispatch: false }
  );

  private _redirectToNextPage() {
    return this.router.navigate(['companies']);
  }
}
