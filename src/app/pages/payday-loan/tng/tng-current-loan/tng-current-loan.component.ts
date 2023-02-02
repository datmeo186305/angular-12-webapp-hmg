import { APPLICATION_TYPE } from './../../../../core/common/enum/payday-loan';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import {
  ERROR_CODE,
  ERROR_CODE_KEY,
  GPAY_RESULT_STATUS,
  PAYDAY_LOAN_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import * as moment from 'moment';
import {
  ApiResponseCompanyInfo,
  ApiResponseCustomerInfoResponse,
  CompanyControllerService,
  CompanyInfo,
  CustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
  ContractControllerService,
  PaydayLoan,
} from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import { Params, Router } from '@angular/router';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../../../core/services/notification.service';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import { Subscription } from 'rxjs';
import formatSlug from 'src/app/core/utils/format-slug';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tng-current-loan',
  templateUrl: './tng-current-loan.component.html',
  styleUrls: ['./tng-current-loan.component.scss'],
})
export class TngCurrentLoanComponent implements OnInit, OnDestroy {
  currentLoan: PaydayLoan = {};
  userInfo: CustomerInfoResponse = {};
  companyInfo: CompanyInfo = {};

  customerId$: Observable<string>;
  customerId: string;

  coreToken$: Observable<string>;
  coreToken: string;

  routerParams$: Observable<Params>;
  routerParams: Params;

  subManager = new Subscription();

  currentLoanStatus: string;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private router: Router,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private applicationControllerService: ApplicationControllerService,
    private contractControllerService: ContractControllerService,
    private infoControllerService: InfoControllerService,
    private titleService: Title,
    private companyControllerService: CompanyControllerService
  ) {
    this._initSubscribeState();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Khoản ứng hiện tại' + ' - ' + environment.PROJECT_NAME
    );
    this.initHeaderInfo();
    this.getActiveLoan();
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromSelectors.getCustomerIdState);
    this.coreToken$ = this.store.select(fromSelectors.getCoreTokenState);
    this.routerParams$ = this.store.select(fromSelectors.getRouterParams);

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );

    this.subManager.add(
      this.routerParams$.subscribe((routerParams) => {
        this.routerParams = routerParams;
      })
    );
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
  }

  viewContract() {
    this.router.navigateByUrl('/tng/sign-contract');
  }

  finalization() {
    this.router.navigateByUrl('/tng/loan-payment');
  }

  initPageTitle(status) {
    let pageTitle = this.getPageTitle(status);
    this.titleService.setTitle(pageTitle + ' - ' + environment.PROJECT_NAME);
  }

  getActiveLoan() {
    this.subManager.add(
      this.applicationControllerService
        .getActivePaydayLoan(this.coreToken, APPLICATION_TYPE.PDL_TNG)
        .subscribe((response: ApiResponsePaydayLoan) => {
          if (response.errorCode || response.responseCode != 200) {
            return this.handleGetActiveLoanError(response);
          }
          this.store.dispatch(new fromActions.SetHasActiveLoanStatus(true));
          this.currentLoan = response.result;
          this.initPageTitle(
            this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
          );
          this.displayPageTitle();
          this.getUserInfo();
        })
    );
  }

  getCompanyInfoById(companyId: string) {
    this.subManager.add(
      this.companyControllerService
        .getCompanyById(companyId)
        .subscribe((responseCompanyInfo: ApiResponseCompanyInfo) => {
          if (
            !responseCompanyInfo ||
            responseCompanyInfo.responseCode !== 200
          ) {
            return this.handleResponseError(responseCompanyInfo.errorCode);
          }
          this.companyInfo = responseCompanyInfo.result;
        })
    );
  }

  handleResponseError(errorCode: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant('common.error'),
      content: this.multiLanguageService.instant(
        errorCode && ERROR_CODE_KEY[errorCode]
          ? ERROR_CODE_KEY[errorCode]
          : 'common.something_went_wrong'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  displayPageTitle() {
    if (
      this.routerParams['status'] !==
      formatSlug(this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS)
    ) {
      this.router.navigate([
        '/tng/current-loan',
        formatSlug(
          this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
        ),
      ]);
    }
  }

  getUserInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (response.responseCode !== 200) {
            this.showErrorModal();
          }
          this.userInfo = response.result;
          this.getCompanyInfoById(response.result?.personalData?.companyId);
        })
    );
  }

  showErrorModal(title?, content?) {
    this.notificationService.openErrorModal({
      title: environment.PRODUCTION
        ? this.multiLanguageService.instant('common.notification')
        : title || this.multiLanguageService.instant('common.notification'),
      content: environment.PRODUCTION
        ? this.multiLanguageService.instant('common.something_went_wrong')
        : content ||
          this.multiLanguageService.instant('common.something_went_wrong'),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  getPageTitle(status) {
    const currentLoanStatus = this.getStatusFromSlug(status);
    if (!currentLoanStatus) {
      return this.multiLanguageService.instant(`page_title.current_loan`);
    }

    let paydayLoanStatuses = Object.values(PAYDAY_LOAN_STATUS);
    let gpayStatuses = Object.values(GPAY_RESULT_STATUS);
    let repaymentStatuses = Object.values(REPAYMENT_STATUS);

    if (paydayLoanStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.status.${currentLoanStatus.toLowerCase()}`
      );
    }

    if (gpayStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.gpay_status.${currentLoanStatus.toLowerCase()}`
      );
    }

    if (repaymentStatuses.includes(currentLoanStatus)) {
      return this.multiLanguageService.instant(
        `payday_loan.current_loan.repayment_status.${currentLoanStatus.toLowerCase()}`
      );
    }

    return this.multiLanguageService.instant(`page_title.current_loan`);
  }

  getStatusFromSlug(value) {
    return value ? value.toUpperCase()?.replace(/-/g, '_') : null;
  }

  handleGetActiveLoanError(response) {
    if (
      response.errorCode === ERROR_CODE.DO_NOT_ACTIVE_LOAN_ERROR ||
      ERROR_CODE.LOAN_NOT_EXIST
    ) {
      this.store.dispatch(new fromActions.SetHasActiveLoanStatus(false));
      this.router.navigateByUrl('companies');
      return;
    }

    this.showErrorModal(response.errorCode, response.message);
  }
}
