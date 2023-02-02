import {ApprovalLetter} from './../../../../../../open-api-modules/customer-api-docs/model/approvalLetter';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {COMPANY_NAME, ERROR_CODE, ERROR_CODE_KEY, PAYDAY_LOAN_STATUS,} from 'src/app/core/common/enum/payday-loan';
import {MultiLanguageService} from '../../../../share/translate/multiLanguageService';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {PdfViewerComponent} from 'ng2-pdf-viewer';
import {
  ApiResponseApprovalLetter,
  ApiResponseCompanyInfo,
  ApiResponseCustomerInfoResponse,
  ApprovalLetterControllerService,
  CompanyControllerService,
  CompanyInfo,
  CustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import {Store} from '@ngrx/store';
import {NotificationService} from '../../../../core/services/notification.service';
import {
  ApiResponseConfirmOTPResponse, ApiResponseCreateDocumentResponse,
  ApiResponseSignWithOTPResponse,
  ConfirmOTPResponse,
  ContractControllerService,
  CreateLetterRequest,
  FileControllerService,
  SendLetterOTPRequest,
} from '../../../../../../open-api-modules/com-api-docs';
import {Router} from '@angular/router';
import {PlPromptComponent} from '../../../../share/components';
import {environment} from 'src/environments/environment';
import formatSlug from '../../../../core/utils/format-slug';
import {BUTTON_TYPE} from '../../../../core/common/enum/prompt';
import * as moment from 'moment';

// import { SignDocumentControllerService } from 'open-api-modules/contract-api-docs';

@Component({
  selector: 'app-tng-sign-contract-terms-of-service',
  templateUrl: './tng-sign-contract-terms-of-service.component.html',
  styleUrls: ['./tng-sign-contract-terms-of-service.component.scss'],
})
export class TngSignContractTermsOfServiceComponent
  implements OnInit, OnDestroy
{
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  linkPdf: any = null;
  userInfo: CustomerInfoResponse = {};
  page: number = 1;
  responsive: boolean = false;
  contractInfo: ApprovalLetter = {};
  isSentOtpOnsign: boolean = false;
  otp: any = [];
  mobile: string = '';
  errorText: string = '';
  disabledOTP: boolean = false;
  errorSendOtpText: string = '';
  method: SendLetterOTPRequest.OtpTypeEnum =
    SendLetterOTPRequest.OtpTypeEnum.Voice;

  idDocument: any = null;
  idRequest: any = null;
  approvalLetterId: any = null;
  companyInfo: CompanyInfo;

  customerId: string;
  customerId$: Observable<string>;

  customerMobile$: Observable<string>;

  isSignContractTermsStatus$: Observable<boolean>;

  isSignContractTermsSuccess$: Observable<boolean>;
  isSignContractTermsSuccess: boolean;

  isSentOtpOnsign$: Observable<boolean>;
  hasActiveLoan$: Observable<boolean>;

  isGetTngInfoFailed: boolean = false;
  zaloURL: string =
    environment.ZALO_URL || 'https://zalo.me/2848902721585176437';

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private contractControllerService: ContractControllerService,
    private approvalLetterControllerService: ApprovalLetterControllerService,
    private fileControllerService: FileControllerService,
    private companyControllerService: CompanyControllerService,
    // private signDocumentControllerService: SignDocumentControllerService,
    //private titleService: Title,
    private router: Router,
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    public sanitizer: DomSanitizer
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    if (environment.MAINTAIN_TNG) {
      this.router.navigateByUrl('/maintain-company');
      return;
    }
    this.onResponsiveInverted();
    window.addEventListener('resize', this.onResponsiveInverted);
    this.getUserInfo();
  }

  private _initSubscribeState() {
    this.customerMobile$ = this.store.select(
      fromSelectors.getCustomerMobileState
    );
    this.customerId$ = this.store.select(fromSelectors.getCustomerIdState);
    this.isSentOtpOnsign$ = this.store.select(fromSelectors.isSentOtpOnsign);

    this.isSignContractTermsSuccess$ = this.store.select(
      fromSelectors.isSignContractTermsSuccess
    );
    this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);
    this.isSignContractTermsStatus$ = this.store.select(
      fromStore.getIsSignContractTermsStatus
    );

    this.subManager.add(
      this.hasActiveLoan$.subscribe((hasActiveLoan) => {
        if (hasActiveLoan) {
          return this.router.navigate([
            '/tng/current-loan',
            formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        }
      })
    );

    this.subManager.add(
      this.isSignContractTermsStatus$.subscribe((isSignContractTermsStatus) => {
        if (isSignContractTermsStatus) {
          return this.router.navigate(['/tng/additional-information']);
        }
      })
    );

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.customerMobile$.subscribe((customerMobile) => {
        this.mobile = customerMobile;
      })
    );

    this.subManager.add(
      this.isSentOtpOnsign$.subscribe((isSentOtpOnsign) => {
        this.isSentOtpOnsign = isSentOtpOnsign;
      })
    );

    this.subManager.add(
      this.isSignContractTermsSuccess$.subscribe(
        (isSignContractTermsSuccess) => {
          this.isSignContractTermsSuccess = isSignContractTermsSuccess;

          if (this.isSignContractTermsSuccess) {
            return this.router.navigateByUrl(
              '/tng/sign-approval-letter-success'
            );
          }
        }
      )
    );

    if (this.isSignContractTermsSuccess) {
      return this.router.navigateByUrl('/tng/sign-approval-letter-success');
    }

    // this.store.dispatch(new fromActions.SetShowLeftBtn(this.isSentOtpOnsign));
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
    this.store.dispatch(new fromActions.SetNavigationTitle('Thư chấp thuận'));
  }

  get showSignContractTermsBtn() {
    return this.contractInfo && this.contractInfo.path;
  }

  openDialogPrompt() {
    const dialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      data: {
        imgBackgroundClass: 'pl-sign-contract-prompt-image',
        imgGroupUrl: 'sprite-group-3-sign-contract-icon-prompt',
        title: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.prompt_title'
        ),
        content: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.prompt_body'
        ),
        secondaryBtnText: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.disagree'
        ),
        primaryBtnText: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.agree'
        ),
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          this.sendLetterOtp();
        }
      })
    );
  }

  sendLetterOtp() {
    let params = this.buildParamsSendLetterOtp();
    this.contractControllerService
      .sendLetter(COMPANY_NAME.TNG, params)
      .subscribe(
        (response: ApiResponseSignWithOTPResponse) => {
          if (response && response.responseCode === 200) {
            this.disabledOTP = false;
            this.idRequest = response.result.idRequest;
            this.idDocument = response.result.idDocument;
            // this.method = response.result.otpType;

            this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(true));
            this.store.dispatch(new fromActions.SetShowLeftBtn(true));
            return;
          }
          if (response.errorCode === ERROR_CODE.SESSION_SIGN_ALREADY_EXIST) {
            this.getLatestApprovalLetter(true);
            return;
          }

          if (response.errorCode === ERROR_CODE.LOCK_CREATE_NEW_SESSION) {
            this.disabledOTP = true;
            return this.showLockedSendOTPMessage(response.result.unLockTime);
          }

          this.errorSendOtpText = this.multiLanguageService.instant(
            'payday_loan.error_code.sent_otp_error'
          );
          this.showErrorModal(
            null,
            environment.PRODUCTION
              ? this.multiLanguageService.instant(
                  'payday_loan.error_code.sent_otp_error'
                )
              : response.message
          );
        },
        (error) => {},
        () => {}
      );
    // this.contractControllerService
    //   .sendLetterOTP(COMPANY_NAME.TNG, params)
    //   .subscribe(
    //     (response: ApiResponseSignWithOTPResponse) => {
    //       if (response && response.responseCode === 200) {
    //         this.disabledOTP = false;
    //         this.idRequest = response.result.idRequest;
    //         this.idDocument = response.result.idDocument;
    //         this.method = response.result.otpType;
    //         this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(true));
    //         this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    //         return;
    //       }
    //       if (response.errorCode === ERROR_CODE.SESSION_SIGN_ALREADY_EXIST) {
    //         this.getLatestApprovalLetter(true);
    //         return;
    //       }

    //       if (response.errorCode === ERROR_CODE.LOCK_CREATE_NEW_SESSION) {
    //         this.disabledOTP = true;
    //         return this.showLockedSendOTPMessage(response.result.unLockTime);
    //       }

    //       this.errorSendOtpText = this.multiLanguageService.instant(
    //         'payday_loan.error_code.sent_otp_error'
    //       );
    //       this.showErrorModal(
    //         null,
    //         environment.PRODUCTION
    //           ? this.multiLanguageService.instant(
    //               'payday_loan.error_code.sent_otp_error'
    //             )
    //           : response.message
    //       );
    //     },
    //     (error) => {},
    //     () => {}
    //   );
  }

  buildParamsSendLetterOtp() {
    const sendLetterOTPRequest: SendLetterOTPRequest = {
      email: this.userInfo?.personalData?.identityNumberSix,
      dateOfBirth: this.userInfo?.personalData?.dateOfBirth,
      name: this.userInfo?.personalData?.firstName,
      address: this.userInfo?.personalData?.addressOneLine1,
      mobile: this.userInfo?.personalData?.mobileNumber,
      nationalId: this.userInfo?.personalData?.identityNumberOne,
      idIssuePlace: this.userInfo?.personalData?.idIssuePlace,
      documentPath: this.contractInfo.path,
      customerId: this.customerId,
      otpType: this.method,
      gender: this.userInfo?.personalData?.gender,
      employeeCode: this.userInfo?.personalData?.organizationName,
    };
    return sendLetterOTPRequest;
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
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

  downloadFile(documentPath) {
    this.subManager.add(
      this.fileControllerService
        .downloadFile({
          customerId: this.customerId,
          documentPath: documentPath,
        })
        .subscribe(
          (response) => {
            this.linkPdf = window.URL.createObjectURL(new Blob([response]));
            console.log('this.linkPdf', this.linkPdf);
          },
          (error) => {},
          () => {}
        )
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

          if (!this.userInfo.personalData.isVerified) {
            this.router.navigateByUrl('/tng/confirm-information');
          }

          if (this.userInfo?.personalData?.companyId) {
            this.getCompanyInfoById(this.userInfo?.personalData?.companyId);
          }

          this.getLatestApprovalLetter();
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

  buildCreateLetterRequest(): CreateLetterRequest {
    return {
      name: this.userInfo?.personalData?.firstName,
      dateOfBirth: this.userInfo?.personalData?.dateOfBirth,
      nationalId: this.userInfo?.personalData?.identityNumberOne,
      customerId: this.customerId,
      idIssuePlace: this.userInfo?.personalData?.idIssuePlace,
      company: this.companyInfo.name,
      employeeCode: this.userInfo?.personalData?.organizationName
    };
  }

  createApprovalLetter() {
    const createLetterRequest: CreateLetterRequest =
      this.buildCreateLetterRequest();

    this.subManager.add(
      this.contractControllerService
        .createLetter(COMPANY_NAME.TNG, createLetterRequest)
        .subscribe((response: ApiResponseCreateDocumentResponse) => {
          if (!response || !response.result || response.responseCode !== 200) {
            return this.showErrorModal();
          }

          if (response.result.documentPath && !this.isSentOtpOnsign) {
            this.contractInfo = {
              path: response.result.documentPath,
            };
            this.downloadFile(this.contractInfo.path);
          }
        })
    );
  }

  getLatestApprovalLetter(setSentOtpStatus: boolean = false) {
    this.subManager.add(
      this.approvalLetterControllerService
        .getApprovalLetterByCustomerId()
        .subscribe((response: ApiResponseApprovalLetter) => {
          if (response.responseCode !== 200) {
            this.contractInfo = null;
            this.createApprovalLetter();
            return;
          }

          if (
            this.userInfo.personalData.signLetterDoneAt &&
            this.userInfo.personalData.approvalLetterId &&
            this.userInfo.personalData.isSignedApprovalLetter
          ) {
            const signLetterDoneAt = moment(
              this.userInfo.personalData.signLetterDoneAt
            );
            const expiredLetterAt = signLetterDoneAt.clone().add(1, 'month');
            const today = moment();
            if (today.isBetween(signLetterDoneAt, expiredLetterAt)) {
              this.infoControllerService
                .requestGetTngData({
                  documentPath: response.result.path,
                })
                .subscribe((response) => {
                  if (!response || response.responseCode !== 200) {
                    return this.handleResponseError(response?.errorCode);
                  }
                  return this.router.navigate(['/tng/additional-information']);
                });
            }
          }

          // if (
          //   response.result.customerSignDone &&
          //   this.userInfo?.personalData?.isSignedApprovalLetter
          // ) {
          //   return this.router.navigate(['/tng/additional-information']);
          // }
          this.idRequest = response.result.idRequest;
          this.idDocument = response.result.idDocument;
          this.approvalLetterId = response.result.id;
          this.contractInfo = response.result;
          this.disabledOTP = false;

          if (
            this.contractInfo &&
            this.contractInfo.idRequest &&
            this.contractInfo.idDocument &&
            setSentOtpStatus
          ) {
            this.disabledOTP = false;
            this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(true));
            this.store.dispatch(new fromActions.SetShowLeftBtn(true));
            return;
          }

          if (
            this.contractInfo &&
            this.contractInfo.path &&
            !this.isSentOtpOnsign
          ) {
            this.downloadFile(this.contractInfo.path);
          }
        })
    );
  }

  resendOtp() {
    this.errorText = null;
    this.errorSendOtpText = null;
    this.otp = [];
    this.sendLetterOtp();
  }

  verifyOtp(otp) {
    this.errorText = null;
    this.errorSendOtpText = null;
    this.otp = otp.split('');

    this.subManager.add(
      this.contractControllerService
        .confirmOtp({
          customerId: this.customerId,
          otp: otp,
          idRequest: this.idRequest,
          idDocument: this.idDocument,
        })
        .subscribe((response: ApiResponseConfirmOTPResponse) => {
          if (!response || response.responseCode !== 200) {
            return this.handleErrorVerifyOtp(response);
          }

          this.customerSignDone(response.result);
        })
    );
  }

  customerSignDone(confirmOTPResponse: ConfirmOTPResponse) {
    let documentPath = confirmOTPResponse.documentPath;
    this.subManager.add(
      this.infoControllerService
        .customerSignDone({
          documentPath: confirmOTPResponse.documentPath,
          idDocument: this.idDocument,
          idRequest: this.idRequest,
        })
        .subscribe((response) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(response?.errorCode);
          }
          this.infoControllerService
            .requestGetTngData({
              documentPath,
            })
            .subscribe((response) => {
              if (!response || response.responseCode !== 200) {
                return this.handleResponseError(response?.errorCode);
              }
              this.store.dispatch(
                new fromActions.SetSignContractTermsSuccess(true)
              );
              this.router.navigateByUrl('/tng/sign-approval-letter-success');
            });
        })
    );
  }

  handleResponseError(errorCode: string) {
    if (errorCode === 'DATA_ERROR') {
     this.isGetTngInfoFailed = true
     return;
    }
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

  signContract() {
    this.openDialogPrompt();
  }

  handleErrorVerifyOtp(response) {
    switch (response.errorCode) {
      case ERROR_CODE.OTP_INVALID:
        this.errorText = this.multiLanguageService.instant(
          `payday_loan.error_code.` + response.errorCode.toLowerCase()
        );
        if (response.result.remainingRequests == 0) {
          this.showErrorModal(
            null,
            this.multiLanguageService.instant(
              'payday_loan.error_code.otp_confirm_maximum'
            )
          );
          this.disabledOTP = true;
          return;
        }

        this.showErrorModal(
          null,
          this.multiLanguageService.instant(
            'payday_loan.verify_otp.n_type_wrong_otp',
            {
              remaining: response.result.remainingRequests,
            }
          )
        );
        break;
      case ERROR_CODE.OTP_EXPIRE_TIME:
      case ERROR_CODE.OTP_CONFIRM_MAXIMUM:
      case ERROR_CODE.ONSIGN_ERROR:
        this.disabledOTP = true;
        this.errorText = this.multiLanguageService.instant(
          ERROR_CODE_KEY[response.errorCode]
        );

        this.showErrorModal(null, this.errorText);
        break;
      case ERROR_CODE.NOT_FOUND_SESSION:
        this.disabledOTP = true;
        this.errorText = this.multiLanguageService.instant(
          ERROR_CODE_KEY[response.errorCode]
        );

        this.showErrorModal(null, this.errorText);
        this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(false));
        this.getLatestApprovalLetter();
        break;
      default:
        this.showErrorModal(null, null);
        break;
    }

    this.otp = [];
  }

  showLockedSendOTPMessage(unlockTime) {
    this.showErrorModal(
      null,
      this.multiLanguageService.instant(
        'payday_loan.contract_terms_of_service.locked_sent_otp',
        {
          minute: environment.LOCKED_SEND_OTP_SIGN_CONTRACT_TERMS_MINUTES,
          unlock_timer: unlockTime,
        }
      )
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResponsiveInverted);
    this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(false));
    this.subManager.unsubscribe();
  }

  afterload() {
    document
      .querySelector('.ng2-pdf-viewer-container')
      .setAttribute('style', 'position: relative !important');
    document
      .querySelector('pdf-viewer')
      .setAttribute('style', 'height: auto !important');
  }

  chooseMethodOtp(event) {
    if (!event) {
      return;
    }
    this.method = event;
    this.resendOtp();
  }
}
