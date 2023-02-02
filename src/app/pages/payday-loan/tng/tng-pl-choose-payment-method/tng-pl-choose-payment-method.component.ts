import { COMPANY_NAME } from './../../../../core/common/enum/payday-loan';
import { ApiResponseGpayNapasOrderRepaymentResponse } from './../../../../../../open-api-modules/payment-api-docs/model/apiResponseGpayNapasOrderRepaymentResponse';
import { Component, OnInit } from '@angular/core';
// import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import * as fromActions from '../../../../core/store';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
} from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import {
  ApiResponseCustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import {
  ApiResponseListRepaymentTransaction,
  ApiResponseVirtualAccount,
  GpayVirtualAccountControllerService,
  RepaymentControllerService,
} from '../../../../../../open-api-modules/payment-api-docs';
import { PaymentProductInfo } from '../../../../public/models/payment-product-info.model';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';
import { PaymentVirtualAccount } from '../../../../public/models/payment-virtual-account.model';
import {
  APPLICATION_TYPE,
  ERROR_CODE,
  PAYDAY_LOAN_STATUS,
} from '../../../../core/common/enum/payday-loan';
import changeAlias from '../../../../core/utils/no-accent-vietnamese';
import formatSlug from '../../../../core/utils/format-slug';

@Component({
  selector: 'app-tng-pl-choose-payment-method',
  templateUrl: './tng-pl-choose-payment-method.component.html',
  styleUrls: ['./tng-pl-choose-payment-method.component.scss'],
})
export class TngPlChoosePaymentMethodComponent implements OnInit {
  currentLoan: PaymentProductInfo = {
    id: '',
    code: '',
    message: '',
    expectedAmount: 0,
    latePenaltyPayment: 0,
  };
  userInfo: PaymentUserInfo = {
    fullName: '',
  };
  vaInfo: PaymentVirtualAccount = {
    accountNumber: '',
    paidAmount: 0,
    bankCode: '',
    accountName: '',
  };

  customerId$: Observable<string>;
  customerId: string;

  coreToken$: Observable<string>;
  coreToken: string;

  companyInfo: COMPANY_NAME = COMPANY_NAME.TNG;

  subManager = new Subscription();

  constructor(
    //private titleService: Title,
    private store: Store<fromStore.State>,
    private router: Router,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private gpayVirtualAccountControllerService: GpayVirtualAccountControllerService,
    private applicationControllerService: ApplicationControllerService,
    private infoControllerService: InfoControllerService,
    private repaymentControllerService: RepaymentControllerService
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Chọn hình thức thanh toán' + ' - ' + environment.PROJECT_NAME
    // );

    this.getUserInfo();
    this.getActiveLoan();
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

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
    this.store.dispatch(
      new fromActions.SetNavigationTitle(
        this.multiLanguageService.instant('page_title.choose_payment_method')
      )
    );
  }

  getRepaymentList() {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .getRepaymentTransactionVirtualAccount(this.currentLoan.id)
        .subscribe((response: ApiResponseListRepaymentTransaction) => {
          if (!response || response.responseCode !== 200) {
            return;
          }
          let paidAmount = 0;
          for (let i = 0; i < response.result.length; i++) {
            paidAmount += response.result[i].amount;
          }

          this.vaInfo.paidAmount = paidAmount;
        })
    );
  }

  finalization() {
    this.subManager.add(
      this.repaymentControllerService
        .gpayRepaymentPaydayLoan({
          customerId: this.customerId,
          applicationId: this.currentLoan.id,
          applicationType: APPLICATION_TYPE.PDL_TNG,
        })
        .subscribe((response: ApiResponseGpayNapasOrderRepaymentResponse) => {
          if (!response || !response.result || !response.result.order_url)
            return;
          window.location.href = response.result.order_url;
        })
    );
  }

  getActiveLoan() {
    this.subManager.add(
      this.applicationControllerService
        .getActivePaydayLoan(this.coreToken, APPLICATION_TYPE.PDL_TNG)
        .subscribe((response: ApiResponsePaydayLoan) => {
          if (
            !response ||
            response.errorCode ||
            response.responseCode !== 200
          ) {
            return this.handleGetActiveLoanError(response);
          }
          this.currentLoan = {
            id: response.result.id,
            message: response.result.loanCode,
            code: response.result.loanCode,
            expectedAmount: response.result.expectedAmount || 0,
            latePenaltyPayment: response.result.latePenaltyPayment || 0,
          };

          if (response.result.status !== PAYDAY_LOAN_STATUS.IN_REPAYMENT) {
            return this.router.navigate([
              '/tng/current-loan',
              formatSlug(
                response.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              ),
            ]);
          }

          this.getVirtualAccount(this.customerId, this.userInfo.fullName);

          this.getRepaymentList();
        })
    );
  }

  getVirtualAccount(customerId, accountName) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .getVirtualAccount(customerId)
        .subscribe((response: ApiResponseVirtualAccount) => {
          if (response.result && response.responseCode === 200) {
            this.vaInfo = {
              ...this.vaInfo,
              accountNumber: response.result.accountNumber,
              accountName: response.result.accountName,
              bankCode: response.result.bankCode,
            };
            return response.result;
          }

          if (response.errorCode === ERROR_CODE.DO_NOT_EXIST_VIRTUAL_ACCOUNT) {
            return this.createVirtualAccount(customerId, accountName);
          }

          this.showErrorModal();
          return null;
        })
    );
  }

  createVirtualAccount(customerId, accountName) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .createVirtualAccount({
          customerId: customerId,
          accountName: changeAlias(accountName),
        })
        .subscribe((response: ApiResponseVirtualAccount) => {
          if (response.result && response.responseCode === 200) {
            this.vaInfo = {
              ...this.vaInfo,
              accountNumber: response.result.accountNumber,
              accountName: response.result.accountName,
              bankCode: response.result.bankCode,
            };
            return response.result;
          }

          this.showErrorModal();
        })
    );
  }

  getUserInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (!response || !response.result || response.responseCode !== 200) {
            return this.showErrorModal();
          }
          this.userInfo = {
            fullName: response.result?.personalData?.firstName,
          };
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

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
