import {
  ContractControllerService
} from './../../../../../../open-api-modules/com-api-docs/api/contractController.service';
import {
  APPLICATION_TYPE,
  COMPANY_NAME,
  ERROR_CODE,
  PAYDAY_LOAN_TERM_TYPE_VAC,
} from '../../../../core/common/enum/payday-loan';
import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import {
  ApiResponseCustomerInfoResponse,
  ApprovalLetterControllerService,
  CustomerInfoResponse,
  InfoControllerService,
  PersonalData,
} from 'open-api-modules/customer-api-docs';
import {Observable, Subscription} from 'rxjs';
import {NotificationService} from 'src/app/core/services/notification.service';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {
  ApiResponseListVoucher,
  ApiResponsePaydayLoan,
  ApiResponseVoucherTransaction,
  ApplicationControllerService,
  CreateApplicationRequest,
  PaydayLoanControllerService,
  PromotionControllerService,
  Voucher,
  VoucherTransaction,
} from 'open-api-modules/loanapp-tng-api-docs';
import {CreateLetterRequest, DownloadFileRequest, FileControllerService,} from 'open-api-modules/com-api-docs';
import formatSlug from 'src/app/core/utils/format-slug';
import {
  DOCUMENT_TYPE,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
  PL_STEP_NAVIGATION,
} from 'src/app/core/common/enum/payday-loan';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {PlVoucherListComponent} from '../../components/pl-voucher-list/pl-voucher-list.component';
import * as moment from 'moment';
import {environment} from 'src/environments/environment';
import * as fromActions from '../../../../core/store';
import {
  IllustratingImgDialogComponent
} from '../../components/illustrating-img-dialog/illustrating-img-dialog.component';
import {PlPromptComponent} from '../../../../share/components';
import getUrlExtension from 'src/app/core/utils/get-url-extension';
import urlToFile from 'src/app/core/utils/url-to-file';
import {
  ApiResponseVirtualAccount,
  GpayVirtualAccountControllerService,
  VirtualAccount,
} from 'open-api-modules/payment-api-docs';
import changeAlias from '../../../../core/utils/no-accent-vietnamese';

@Component({
  selector: 'app-vac-loan-determination',
  templateUrl: './vac-loan-determination.component.html',
  styleUrls: ['./vac-loan-determination.component.scss'],
})
export class VacLoanDeterminationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  virtualAccount: VirtualAccount;
  loanDeterminationForm: FormGroup;
  maxAmount: number;
  minAmount: number = environment.MIN_VALUE;
  step: number = environment.STEP_VALUE;
  loanPurpose = {
    fieldName: this.multiLanguageService.instant(
      'payday_loan.choose_amount.loan_purpose'
    ),
    options: [
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_living'
      ),
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_medical'
      ),
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_insurance'
      ),
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_education'
      ),
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_incur'
      ),
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_investment'
      ),
      this.multiLanguageService.instant(
        'payday_loan.choose_amount.loan_purpose_orther'
      ),
    ],
  };
  collateralImgSrc: any;
  collateralFile: any;
  originalCollateralFile: any;

  customerInfo: CustomerInfoResponse;
  coreUserId: string;
  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  public loanDetermination$: Observable<any>;
  loanDetermination: object;

  listVoucher: Array<Voucher>;
  voucherShowError: string;
  voucherApplied: Voucher;
  voucherAppliedTransition: VoucherTransaction;
  discount: number = 0;
  isCorrectedVoucherApplied: boolean = false;

  intervalTime: any;
  disabledBtn: boolean = false;
  countdownTime: number = environment.DEFAULT_DISABLED_BTN_TIME;

  applicationType: APPLICATION_TYPE;
  isDisableTermChoose: boolean = false;
  termTypeOptions = [
    {
      value: PAYDAY_LOAN_TERM_TYPE_VAC.ONE_MONTH,
      viewValue: this.multiLanguageService.instant(
        'payday_loan.choose_amount.one_month'
      ),
    },
    {
      value: PAYDAY_LOAN_TERM_TYPE_VAC.THREE_MONTH,
      viewValue: this.multiLanguageService.instant(
        'payday_loan.choose_amount.three_months'
      ),
    },
  ];

  paymentDayRoute = { first: null, second: null, third: null };
  intervalProcess: any;

  subManager = new Subscription();
  @ViewChild('inputEle') inputEle: ElementRef;

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private applicationControllerService: ApplicationControllerService,
    private fileControllerService: FileControllerService,
    private paydayLoanControllerService: PaydayLoanControllerService,
    private promotionControllerService: PromotionControllerService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private promptDialogRef: MatDialogRef<PlPromptComponent>,
    private contractControllerService: ContractControllerService,
    private approvalLetterControllerService: ApprovalLetterControllerService,
    private gpayVirtualAccountControllerService: GpayVirtualAccountControllerService
  ) {
    this.loanDeterminationForm = fb.group({
      loanAmount: ['', Validators.required],
      loanPurpose: [''],
      collateralDocument: ['', Validators.required],
      voucherCode: [''],
      termType: [
        {
          value: [''],
          disabled: this.isDisableTermChoose,
        },
      ],
    });
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    //get customer id, password & core token from store
    this.getVoucherList();
    this.setPaymentDayRoute();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  ngAfterViewInit() {
    this.loanDeterminationForm.controls['loanAmount'].setValue(this.minAmount);
    this.loanDeterminationForm.controls['termType'].setValue(
      PAYDAY_LOAN_TERM_TYPE_VAC.ONE_MONTH
    );
    this.loanDeterminationForm.controls['voucherCode'].valueChanges.subscribe(
      (ele) => {
        if (
          this.loanDeterminationForm.controls['voucherCode'].value === '' &&
          this.isCorrectedVoucherApplied
        ) {
          this.clearDiscount();
        }
      }
    );
    this.getCustomerInfo();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalProcess);
    this.subManager.unsubscribe();
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
      })
    );
    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(true));
    this.store.dispatch(
      new fromActions.SetStepNavigationInfo(
        PL_STEP_NAVIGATION.CHOOSE_AMOUNT_TO_BORROW
      )
    );
  }

  getCustomerInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(response?.errorCode);
          }
          this.customerInfo = response.result;

          if (this.customerInfo.personalData.collateralDocument) {
            this.loanDeterminationForm.controls['collateralDocument'].setValue(
              this.customerInfo.personalData.collateralDocument
            );
          }

          this.store.dispatch(new fromActions.SetCustomerInfo(response.result));
          this.initAmountSliderValue();

          this.checkLoanExisted();
        })
    );
  }

  getLastLoanDeterminationFromStore() {
    this.loanDetermination$ = this.store.select(
      fromStore.getLoanDeterminationState
    );
    this.subManager.add(
      this.loanDetermination$.subscribe((loanDetermination) => {
        if (loanDetermination) {
          this.loanDeterminationForm.patchValue({
            loanAmount: loanDetermination.expectedAmount,
            loanPurpose: loanDetermination.purpose,
            voucherCode: loanDetermination.voucherCode,
            termType: loanDetermination.termType,
          });
        }
      })
    );
  }

  handleResponseError(errorCode: string) {
    return this.showError(
      'common.error',
      errorCode ? ERROR_CODE_KEY[errorCode] : 'common.something_went_wrong'
    );
  }

  checkLoanExisted() {
    this.applicationType =
      this.customerInfo.personalData.employeeType ===
      PersonalData.EmployeeTypeEnum.Office
        ? APPLICATION_TYPE.PDL_VAC_OFFICE
        : APPLICATION_TYPE.PDL_VAC_FACTORY;
    this.applicationControllerService
      .getActivePaydayLoan(this.coreToken, this.applicationType)
      .subscribe((result: ApiResponsePaydayLoan) => {
        if (result.responseCode === 200) {
          return this.router.navigate([
            '/vac/current-loan',
            formatSlug(
              result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        }
        this.bindingCollateralDocument();
      });
  }

  bindingCollateralDocument() {
    if (
      !this.customerInfo?.personalData ||
      !this.customerInfo?.personalData.collateralDocument
    )
      return;

    const downloadFileRequest: DownloadFileRequest = {
      documentPath: this.customerInfo?.personalData.collateralDocument,
      customerId: this.customerId,
    };
    this.fileControllerService
      .downloadFile(downloadFileRequest)
      .subscribe((blob) => {
        let objectURL = URL.createObjectURL(blob);
        this.originalCollateralFile = objectURL;
        this.collateralImgSrc =
          this.sanitizer.bypassSecurityTrustUrl(objectURL);
      });
  }

  resultCollateral(result) {
    this.loanDeterminationForm.controls['collateralDocument'].setValue(
      result.file
    );
    this.collateralImgSrc = result.imgSrc;
  }

  onSubmit() {
    if (this.loanDeterminationForm.invalid) return;
    this.disabledBtn = true;
    this.countdownTimer(this.countdownTime);
    this.uploadFileCollateralDocument();
  }

  createNewApplication() {
    if (!this.coreToken) {
      return this.showError('common.error', 'common.something_went_wrong');
    }

    const createApplicationRequest: CreateApplicationRequest =
      this.buildApplicationRequest();

    this.subManager.add(
      this.paydayLoanControllerService
        .createApplication(createApplicationRequest)
        .subscribe((response: ApiResponsePaydayLoan) => {
          if (!response || response.responseCode !== 200) {
            return this.showError(
              'payday_loan.choose_amount.create_loan_failed_title',
              'payday_loan.choose_amount.create_loan_failed_desc'
            );
          }
          this.openCreateLoanSuccessModal();
        })
    );
  }

  buildApplicationRequest(): CreateApplicationRequest {
    return {
      coreToken: this.coreToken,
      applicationType: this.applicationType,
      expectedAmount: this.loanDeterminationForm.controls.loanAmount.value,
      purpose: this.loanDeterminationForm.controls.loanPurpose.value,
      termType: this.loanDeterminationForm.controls.termType.value,
      voucherTransactionId: this.voucherAppliedTransition?.id,
    };
  }

  uploadFileCollateralDocument() {
    //call api com svc upload document vehicle registration
    if (
      this.loanDeterminationForm.controls['collateralDocument'].value &&
      this.loanDeterminationForm.controls['collateralDocument'].value instanceof
        File
    ) {
      this.collateralDocumentFileUpload(
        this.loanDeterminationForm.controls['collateralDocument'].value
      );
      return;
    }

    // Update old img to upload document in core
    let fileExtension = getUrlExtension(
      this.customerInfo?.personalData.collateralDocument
    );
    let fileName =
      'collateral-document-' + this.customerId + '.' + fileExtension;
    urlToFile(this.originalCollateralFile, fileName, fileExtension).then(
      (file) => {
        this.collateralDocumentFileUpload(file);
      }
    );
  }

  collateralDocumentFileUpload(file) {
    this.fileControllerService
      .uploadSingleFile(
        DOCUMENT_TYPE.VEHICLE_REGISTRATION,
        file,
        this.customerId
      )
      .subscribe((response) => {
        if (!response || response.responseCode !== 200) {
          return this.handleResponseError(response?.errorCode);
        }
        this.store.dispatch(
          new fromActions.SetLoanDetermination({
            coreToken: this.coreToken,
            applicationType: this.applicationType,
            expectedAmount:
              this.loanDeterminationForm.controls.loanAmount.value,
            loanPurpose: this.loanDeterminationForm.controls.loanPurpose.value,
            termType: this.loanDeterminationForm.controls.termType.value,
            voucherCode: this.loanDeterminationForm.controls.voucherCode.value,
            voucherTransactionId: this.voucherAppliedTransition
              ? this.voucherAppliedTransition?.id
              : null,
          })
        );
        this.getVirtualAccount(
          this.customerId,
          this.customerInfo?.personalData.firstName
        );
        // this.router.navigateByUrl('/vac/sign-approval-letter');
        // this.createNewApplication();
      });
  }

  createVirtualAccount(customerId, accountName) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .createVirtualAccount(
          {
            customerId: customerId,
            accountName: changeAlias(accountName),
          },
          null,
          true
        )
        .subscribe((response: ApiResponseVirtualAccount) => {
          if (response.result && response.responseCode === 200) {
            this.virtualAccount = response.result;
            this.store.dispatch(new fromActions.SetVirtualAccountInfo(response.result));
            return this.createApprovalLetter()
          }

          this.showErrorModal();
        })
    );
  }

  getVirtualAccount(customerId, accountName) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .getVirtualAccount(customerId, null, true)
        .subscribe((response: ApiResponseVirtualAccount) => {
          if (response.result && response.responseCode === 200) {
            this.virtualAccount = response.result;
            this.store.dispatch(new fromActions.SetVirtualAccountInfo(response.result));
            return this.createApprovalLetter()
          }

          if (response.errorCode === ERROR_CODE.DO_NOT_EXIST_VIRTUAL_ACCOUNT) {
            return this.createVirtualAccount(customerId, accountName);
          }

          this.showErrorModal();
          return;
        })
    );
  }

  createApprovalLetter() {
    const createLetterRequest: CreateLetterRequest =
      this.buildCreateLetterRequest();

    let companyName = COMPANY_NAME.VACFACTORY
    if(this.customerInfo?.personalData?.employeeType === PersonalData.EmployeeTypeEnum.Office) {
      companyName =  COMPANY_NAME.VACOFFICE;
    }

    this.subManager.add(
      this.contractControllerService
        .createLetter(companyName, createLetterRequest)
        .subscribe((result) => {
          if (!result || result.responseCode !== 200) {
            return this.handleResponseError(result.errorCode);
          }

          this.router.navigateByUrl('/vac/sign-approval-letter');
        })
    );
  }

  buildCreateLetterRequest(): CreateLetterRequest {
    return {
      dateOfBirth: this.customerInfo.personalData?.dateOfBirth,
      name: this.customerInfo.personalData?.firstName,
      nationalId: this.customerInfo.personalData?.identityNumberOne,
      customerId: this.customerId,
      idIssuePlace: this.customerInfo.personalData?.idIssuePlace,
      company: this.customerInfo.personalData?.companyName,
      loanAmount: this.loanDeterminationForm.controls['loanAmount'].value ,
      vaAccountOwner: this.virtualAccount?.accountName,
      vaAccountNumber: this.virtualAccount?.accountNumber,
      accountOwner: this.customerInfo?.personalData?.firstName,
      accountNumber: this.customerInfo?.financialData?.accountNumber,
      isThreeMonths: this.loanDeterminationForm.controls['termType'].value === PAYDAY_LOAN_TERM_TYPE_VAC.THREE_MONTH
    };
  }

  getVoucherList() {
    this.subManager.add(
      this.promotionControllerService
        .getVoucherByScopeEvent()
        .subscribe((response: ApiResponseListVoucher) => {
          if (!response && response.responseCode !== 200) {
            return this.handleResponseError(response?.errorCode);
          }
          this.listVoucher = response.result;
        })
    );
  }

  openDialogVoucherList() {
    const dialogRef = this.dialog.open(PlVoucherListComponent, {
      width: '320px',
      autoFocus: false,
      data: this.listVoucher,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: Voucher) => {
      if (!result) return;
      this.loanDeterminationForm.controls.voucherCode.setValue(result.code);
      this.checkVoucherApplied();
    });
  }

  //Tính ngày thanh toán theo lộ trình
  setPaymentDayRoute() {
    const today = moment();
    let getSalaryDay = moment().set('date', 15);

    if (today.get('date') >= 15) {
      getSalaryDay = getSalaryDay.add(1, 'month');
    }
    this.paymentDayRoute.first = getSalaryDay.format('DD/MM/yyyy');
    this.paymentDayRoute.second = getSalaryDay
      .clone()
      .add(1, 'month')
      .format('DD/MM/yyyy');
    this.paymentDayRoute.third = getSalaryDay
      .clone()
      .add(2, 'month')
      .format('DD/MM/yyyy');
  }

  get loanAmountFormatMillionPrice() {
    return this.loanDeterminationForm.controls['loanAmount'].value;
  }

  //Phí dịch vụ
  get originalLoanFee() {
    //Thiết lập % phí dịch vụ
    const serviceFeeRatio =
      this.loanDeterminationForm.controls['termType'].value ===
      PAYDAY_LOAN_TERM_TYPE_VAC.ONE_MONTH
        ? environment.SERVICE_FEE_RATIO_VAC_ONE_MONTH
        : environment.SERVICE_FEE_RATIO_VAC_THREE_MONTH * 3;

    const originalFee = this.loanAmountFormatMillionPrice * serviceFeeRatio;
    return originalFee < environment.FIXED_MIN_LOAN_FEE_VAC
      ? environment.FIXED_MIN_LOAN_FEE_VAC
      : originalFee;
  }

  //Phí VAT
  get vatFee() {
    return (this.originalLoanFee - this.discount) * 0.1;
  }

  //Phí xử lý giao dịch
  get transitionProcessFee() {
    return this.loanDeterminationForm.controls['termType'].value ===
      PAYDAY_LOAN_TERM_TYPE_VAC.ONE_MONTH
      ? environment.FIXED_TRANSITION_PROCESS_FEE
      : environment.FIXED_REPAYMENT_VA_FEE * 3 +
          environment.FIXED_DISBURSEMENT_FEE;
  }

  //Tỏng phí thanh toán
  get loanFeeTotal() {
    return (
      this.originalLoanFee -
      this.discount +
      this.vatFee +
      this.transitionProcessFee
    );
  }

  //Tính số tiền thanh toán ở lộ trình 2 tháng đầu
  get paymentRouteAmount() {
    return (
      Math.floor(
        this.loanDeterminationForm.controls['loanAmount'].value / 1000 / 3
      ) * 1000
    );
  }

  //Tính số tiền thanh toán ở lộ trình tháng cuối
  get lastPaymentRouteAmount() {
    return (
      (Math.floor(
        this.loanDeterminationForm.controls['loanAmount'].value / 1000 / 3
      ) +
        ((this.loanDeterminationForm.controls['loanAmount'].value / 1000) %
          3)) *
      1000
    );
  }

  checkVoucherApplied() {
    // Pick voucher from dialog
    if (this.loanDeterminationForm.controls.voucherCode.value === '') {
      return;
    }

    for (const voucher of this.listVoucher) {
      if (
        voucher.code.toUpperCase() ===
        this.loanDeterminationForm.controls.voucherCode.value.toUpperCase()
      ) {
        this.loanDeterminationForm.controls.voucherCode.setValue(voucher.code);
        this.promotionControllerService
          .validateVoucher({
            customerId: this.customerId,
            voucherId: voucher.id,
          })
          .subscribe((response: ApiResponseVoucherTransaction) => {
            if (!response || response.responseCode !== 200) {
              this.loanDeterminationForm.controls.voucherCode.setErrors({
                invalid: true,
              });
              this.inputEle.nativeElement.focus();
              this.inputEle.nativeElement.blur();
              this.voucherShowError = this.multiLanguageService.instant(
                `payday_loan.voucher.${response.errorCode.toLowerCase()}`
              );
              this.isCorrectedVoucherApplied = false;
              return;
            }
            this.voucherAppliedTransition = response.result;
            this.voucherApplied = voucher;
            this.applyCorrectedVoucher(this.voucherApplied);
          });
        return;
      }
    }
    this.loanDeterminationForm.controls.voucherCode.setErrors({
      invalid: true,
    });
    this.voucherShowError = this.multiLanguageService.instant(
      'payday_loan.voucher.voucher_not_exist'
    );
  }

  applyCorrectedVoucher(voucher: Voucher) {
    if (!voucher) {
      return;
    }
    this.discount = voucher.percentage * this.originalLoanFee;

    // check max discount accepted
    if (this.discount > voucher.maxValue) {
      this.discount = voucher.maxValue;
    }
    this.voucherShowError = '';
    this.isCorrectedVoucherApplied = true;
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  dec2time(decimalTimeString) {
    let decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    let hours = Math.floor(decimalTime / (60 * 60));
    decimalTime = decimalTime - hours * 60 * 60;
    let minutes = Math.floor(decimalTime / 60);
    decimalTime = decimalTime - minutes * 60;
    let seconds = Math.round(decimalTime);

    let strHours = String(hours);
    let strMinutes = String(minutes);
    let strSeconds = String(seconds);
    strMinutes;
    if (hours < 10) {
      strHours = '0' + strHours;
    }
    if (minutes < 10) {
      strMinutes = '0' + minutes;
    }
    if (seconds < 10) {
      strSeconds = '0' + strSeconds;
    }
    return strHours + ':' + strMinutes + ':' + strSeconds;
  }

  checkVoucherTime(voucher: Voucher): boolean {
    let d = new Date();
    for (const timeRange of voucher.activedTime) {
      timeRange.split('-');
      let start = moment(this.dec2time(timeRange[0]), 'HH:mm:ss').toDate();
      let end = moment(this.dec2time(timeRange[1]), 'HH:mm:ss').toDate();
      //check current time in range
      if (start.getHours() < d.getHours() && d.getHours() < end.getHours()) {
        return true;
      } else if (start.getHours() == d.getHours()) {
        if (d.getHours() == end.getHours()) {
          if (
            start.getMinutes() <= d.getMinutes() &&
            d.getMinutes() <= end.getMinutes()
          ) {
            return true;
          }
        } else if (start.getMinutes() <= d.getMinutes()) {
          return true;
        }
      } else if (d.getHours() == end.getHours()) {
        if (d.getMinutes() <= end.getMinutes()) {
          return true;
        }
      }
    }
    return false;
  }

  //Expected loan amount
  onValueChange(event) {
    this.loanDeterminationForm.controls.loanAmount.setValue(event.value);
    this.applyCorrectedVoucher(this.voucherApplied);

    //Kiểm tra trường hợp VAC_OFFICE thì chọn kì hạn ứng phụ thuộc vào % Khoản ứng với mức lương
    if (this.applicationType === APPLICATION_TYPE.PDL_VAC_OFFICE) {
      const percentLoan =
        this.loanDeterminationForm.controls.loanAmount.value /
        this.customerInfo.personalData.annualIncome;
      if (percentLoan < 0.5) {
        this.isDisableTermChoose = true;
        this.loanDeterminationForm.controls.termType.setValue(
          PAYDAY_LOAN_TERM_TYPE_VAC.ONE_MONTH
        );
      } else if (percentLoan < 1) {
        this.isDisableTermChoose = false;
      } else {
        this.isDisableTermChoose = true;
        this.loanDeterminationForm.controls.termType.setValue(
          PAYDAY_LOAN_TERM_TYPE_VAC.THREE_MONTH
        );
      }
    }
  }

  initAmountSliderValue() {
    if (!this.customerInfo.personalData?.annualIncome) {
      return;
    }

    this.maxAmount = this.getMaxValue(
      this.customerInfo.personalData.annualIncome
    );

    //Example 3.000.000, 2.500.000, 3.500.000 , expected defaultAmountValue = 1.500.000, 1.500.000, 2.000.000
    let defaultAmountValue: any;
    if ((this.maxAmount / this.step) % 2 === 0) {
      defaultAmountValue = Math.round(this.maxAmount / 2);
    } else {
      defaultAmountValue = Math.round((this.maxAmount + this.step) / 2);
    }

    //default < Min value
    if (defaultAmountValue >= this.minAmount) {
      this.loanDeterminationForm.controls['loanAmount'].setValue(
        defaultAmountValue
      );
    }

    //Lấy thông tin từ store fill vào
    this.getLastLoanDeterminationFromStore();
  }

  getMaxValue(annualIncome) {
    const millionAnnualIncome = annualIncome / 1000000;
    let percentSalary;
    if (
      this.customerInfo.personalData?.employeeType ===
      PersonalData.EmployeeTypeEnum.Office
    ) {
      percentSalary = millionAnnualIncome * 1.5;
    } else {
      percentSalary = millionAnnualIncome * 1;
    }

    if (percentSalary % 1 >= 0.5) {
      return (Math.round(percentSalary) - 0.5) * 1000000;
    }
    return Math.floor(percentSalary) * 1000000;
  }

  clearVoucherInput() {
    this.voucherShowError = '';
    this.loanDeterminationForm.controls.voucherCode.setValue('');
    this.clearDiscount();
  }

  clearDiscount() {
    this.isCorrectedVoucherApplied = false;
    this.voucherAppliedTransition = null;
    this.voucherApplied = null;
    this.discount = 0;
  }

  openDialogIllustratingImage() {
    const dialogRef = this.dialog.open(IllustratingImgDialogComponent, {
      width: '332px',
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });
  }

  openCreateLoanSuccessModal() {
    this.promptDialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '330px',
      data: {
        imgBackgroundClass: 'text-center',
        imgUrl: 'assets/img/payday-loan/success-prompt-icon.png',
        title: this.multiLanguageService.instant(
          'payday_loan.choose_amount.choose_amount_successful'
        ),
        content: this.multiLanguageService.instant(
          'payday_loan.choose_amount.choose_amount_successful_content'
        ),
        primaryBtnText: this.multiLanguageService.instant(
          'payday_loan.choose_amount.go_to_loan_detail'
        ),
      },
    });

    this.subManager.add(
      this.promptDialogRef.afterClosed().subscribe((confirmed: boolean) => {
        return this.router.navigate([
          '/vac/current-loan',
          formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
        ]);
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

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    this.intervalProcess = this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById(
        'loan-determination-countdown-timer'
      ).textContent = '( ' + duration.asSeconds() + 's )';
      if (duration.asSeconds() == 0) {
        clearInterval(this.intervalProcess);
        this.disabledBtn = false;
      }
    }, interval);
  }
}
