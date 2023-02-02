import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import {
  DownloadFileRequest,
  FileControllerService,
} from 'open-api-modules/com-api-docs';
import formatSlug from 'src/app/core/utils/format-slug';
import {
  APPLICATION_TYPE,
  DOCUMENT_TYPE,
  ERROR_CODE,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
  PL_STEP_NAVIGATION,
} from 'src/app/core/common/enum/payday-loan';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlVoucherListComponent } from '../../components/pl-voucher-list/pl-voucher-list.component';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import * as fromActions from '../../../../core/store';
import { IllustratingImgDialogComponent } from '../../components/illustrating-img-dialog/illustrating-img-dialog.component';
import { PlPromptComponent } from '../../../../share/components';
import getUrlExtension from 'src/app/core/utils/get-url-extension';
import urlToFile from 'src/app/core/utils/url-to-file';
import {
  ApiResponseListVoucher,
  ApiResponseLoanDetailDto,
  ApiResponsePaydayLoan, ApiResponseVoucherTransaction,
  ApplicationControllerService, CreateApplicationRequest,
  MifosPaydayLoanControllerService,
  PaydayLoanControllerService,
  PromotionControllerService,
  Voucher,
  VoucherTransaction
} from "../../../../../../open-api-modules/loanapp-tng-api-docs";

@Component({
  selector: 'app-loan-determination',
  templateUrl: './loan-determination.component.html',
  styleUrls: ['./loan-determination.component.scss'],
})
export class LoanDeterminationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  loanDeterminationForm: FormGroup;
  maxAmount: number;
  minAmount: number = environment.MIN_VALUE;
  step: number = environment.STEP_VALUE;
  loanPurpose = {
    fieldName: 'Mục đích ứng lương',
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

  listVoucher: Array<Voucher>;
  voucherShowError: string;
  voucherApplied: Voucher;
  voucherAppliedTransition: VoucherTransaction;
  discount: number = 0;
  isCorrectedVoucherApplied: boolean = false;

  intervalTime: any;
  disabledBtn: boolean = false;
  countdownTime: number = environment.DEFAULT_DISABLED_BTN_TIME;

  subManager = new Subscription();
  @ViewChild('inputEle') inputEle: ElementRef;

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private applicationControllerService: ApplicationControllerService,
    private mifosPaydayLoanControllerService: MifosPaydayLoanControllerService,
    private fileControllerService: FileControllerService,
    private paydayLoanControllerService: PaydayLoanControllerService,
    private promotionControllerService: PromotionControllerService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    //private titleService: Title,
    private promptDialogRef: MatDialogRef<PlPromptComponent>
  ) {
    this.loanDeterminationForm = fb.group({
      loanAmount: ['', Validators.required],
      loanPurpose: [''],
      collateralDocument: ['', Validators.required],
      voucherCode: [''],
    });
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    //get customer id, password & core token from store

    // this.titleService.setTitle(
    //   'Chọn số tiền cần ứng' + ' - ' + environment.PROJECT_NAME
    // );
    this.getVoucherList();
     window.scroll({
       top: 0,
       left: 0,
       behavior: 'smooth',
     });
  }

  ngAfterViewInit() {
    this.loanDeterminationForm.controls['loanAmount'].setValue(this.minAmount);
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

  handleResponseError(errorCode: string) {
    return this.showError(
      'common.error',
      errorCode ? ERROR_CODE_KEY[errorCode] : 'common.something_went_wrong'
    );
  }

  checkLoanExisted() {
    this.mifosPaydayLoanControllerService
      .getActivePaydayLoanMifos(this.customerId, APPLICATION_TYPE.PDL_HMG)
      .subscribe((result: ApiResponsePaydayLoan) => {
        if (result.responseCode === 200) {
          return this.router.navigate([
            '/hmg/current-loan',
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
    // if (!this.coreToken) {
    //   return this.showError('common.error', 'common.something_went_wrong');
    // }

    const createApplicationRequest: CreateApplicationRequest =
      this.buildApplicationRequest();

    this.subManager.add(
      this.mifosPaydayLoanControllerService
        .createApplicationMifos(createApplicationRequest)
        .subscribe((response: ApiResponseLoanDetailDto) => {
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
      applicationType: APPLICATION_TYPE.PDL_HMG,
      termType: null,
      expectedAmount: this.loanDeterminationForm.controls.loanAmount.value,
      purpose: this.loanDeterminationForm.controls.loanPurpose.value,
      voucherTransactionId: this.voucherAppliedTransition?.id
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
        this.createNewApplication();
      });
  }

  getVoucherList() {
    this.subManager.add(
      this.promotionControllerService
        .getVoucherByScopeEvent()
        .subscribe((response: ApiResponseListVoucher) => {
          if (!response || response.responseCode !== 200) {
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

  get loanAmountFormatMillionPrice() {
    return this.loanDeterminationForm.controls['loanAmount'].value;
  }

  get originalLoanFee() {
    const originalFee =
      this.loanAmountFormatMillionPrice * environment.SERVICE_FEE_RATIO_HMG;
    return originalFee;
  }

  get loanFeeTotal() {
    return (
      this.originalLoanFee -
      this.discount +
      environment.FIXED_DISBURSEMENT_FEE +
      environment.FIXED_REPAYMENT_VA_FEE
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

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'HH:mm:ss').format('HH:mm');
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
  }

  getMaxValue(annualIncome) {
    let millionAnnualIncome =
      (environment.MAX_PERCENT_AMOUNT * annualIncome) / 1000000;

    if (millionAnnualIncome % 1 >= 0.5) {
      return (Math.round(millionAnnualIncome) - 0.5) * 1000000;
    }

    return Math.floor(millionAnnualIncome) * 1000000;
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
          '/hmg/current-loan',
          formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
        ]);
      })
    );
  }

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    let intervalProcess = (this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById(
        'loan-determination-countdown-timer'
      ).textContent = '( ' + duration.asSeconds() + 's )';
      if (duration.asSeconds() == 0) {
        clearInterval(intervalProcess);
        this.disabledBtn = false;
      }
    }, interval));
  }
}
