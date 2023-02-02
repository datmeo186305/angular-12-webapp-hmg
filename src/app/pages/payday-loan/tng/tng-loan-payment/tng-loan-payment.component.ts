import { APPLICATION_TYPE } from './../../../../core/common/enum/payday-loan';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
  PaydayLoan,
} from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import {
  ApiResponseCompanyInfo,
  ApiResponseCustomerInfoResponse,
  CompanyControllerService,
  CompanyInfo,
  CustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import {
  ApiResponseListRepaymentTransaction,
  GpayVirtualAccountControllerService,
} from '../../../../../../open-api-modules/payment-api-docs';
import * as fromSelectors from '../../../../core/store/selectors';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import * as fromActions from '../../../../core/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
// import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import {
  ERROR_CODE,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
} from '../../../../core/common/enum/payday-loan';
import formatSlug from '../../../../core/utils/format-slug';

@Component({
  selector: 'app-tng-loan-payment',
  templateUrl: './tng-loan-payment.component.html',
  styleUrls: ['./tng-loan-payment.component.scss'],
})
export class TngLoanPaymentComponent implements OnInit, OnDestroy {
  currentLoan: PaydayLoan = {};
  companyInfo: CompanyInfo = {};
  userInfo: CustomerInfoResponse = {};

  customerId$: Observable<string>;
  customerId: string;

  coreToken$: Observable<string>;
  coreToken: string;

  paidAmount: number = 0;

  subManager = new Subscription();

  constructor(
    private gpayVirtualAccountControllerService: GpayVirtualAccountControllerService,
    private applicationControllerService: ApplicationControllerService,
    private infoControllerService: InfoControllerService,
    private store: Store<fromStore.State>,
    private router: Router,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private companyControllerService: CompanyControllerService
  ) //private titleService: Title
  {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Chi tiết khoản tất toán' + ' - ' + environment.PROJECT_NAME
    // );

    this.getUserInfo();
    this.getActiveLoan();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(
      new fromActions.SetNavigationTitle(
        this.multiLanguageService.instant('page_title.loan_payment')
      )
    );
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromSelectors.getCustomerIdState);
    this.coreToken$ = this.store.select(fromSelectors.getCoreTokenState);

    this.customerId$.subscribe((customerId) => {
      this.customerId = customerId;
    });

    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );
  }

  getRepaymentList() {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .getRepaymentTransactionVirtualAccount(this.currentLoan.id)
        .subscribe(
          (response: ApiResponseListRepaymentTransaction) => {
            if (!response || response.responseCode !== 200) {
              return;
            }
            let paidAmount = 0;
            for (let i = 0; i < response.result.length; i++) {
              paidAmount += response.result[i].amount;
            }

            this.paidAmount = paidAmount;
          },
          (error) => {},
          () => {}
        )
    );
  }

  getActiveLoan() {
    this.subManager.add(
      this.applicationControllerService
        .getActivePaydayLoan(this.coreToken, APPLICATION_TYPE.PDL_TNG)
        .subscribe((response: ApiResponsePaydayLoan) => {
          if (response.errorCode || response.responseCode !== 200) {
            return this.handleGetActiveLoanError(response);
          }

          this.currentLoan = response.result;

          if (this.currentLoan.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT) {
            return this.router.navigate([
              '/tng/current-loan',
              formatSlug(
                this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              ),
            ]);
          }

          this.getRepaymentList();
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

  getUserInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (response.responseCode !== 200) {
            return this.showErrorModal();
          }
          this.userInfo = response.result;
          this.getCompanyInfoById(response.result?.personalData?.companyId);
        })
    );
  }

  showErrorModal(title?, content?) {
    this.notificationService.openErrorModal({
      title: title || this.multiLanguageService.instant('common.notification'),
      content:
        content ||
        this.multiLanguageService.instant('common.something_went_wrong'),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
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

  handleGetActiveLoanError(response: ApiResponsePaydayLoan) {
    if (
      response.errorCode === ERROR_CODE.DO_NOT_ACTIVE_LOAN_ERROR ||
      ERROR_CODE.LOAN_NOT_EXIST
    ) {
      this.store.dispatch(new fromActions.SetHasActiveLoanStatus(false));
      this.router.navigateByUrl('companies');
      return;
    }

    this.showErrorModal(
      environment.PRODUCTION === true
        ? this.multiLanguageService.instant('common.something_went_wrong')
        : response.errorCode,
      environment.PRODUCTION === true
        ? this.multiLanguageService.instant('common.something_went_wrong')
        : response.message
    );
  }

  finalization() {
    this.router.navigateByUrl('/tng/choose-payment-method');
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
