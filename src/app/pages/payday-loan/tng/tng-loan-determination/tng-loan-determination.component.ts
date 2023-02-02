import { ApiResponseVoucher } from './../../../../../../open-api-modules/loanapp-tng-api-docs/model/apiResponseVoucher';
import {
  PAYDAY_LOAN_UI_STATUS,
  APPLICATION_TYPE,
} from './../../../../core/common/enum/payday-loan';
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
  ApiResponseListVoucher,
  ApiResponsePaydayLoan,
  ApiResponseVoucherTransaction,
  ApplicationControllerService,
  CreateApplicationRequest,
  PaydayLoan,
  PaydayLoanControllerService,
  PromotionControllerService,
  UpdateLoanAmountRequest,
  Voucher,
  VoucherTransaction,
} from 'open-api-modules/loanapp-tng-api-docs';
import {
  DownloadFileRequest,
  FileControllerService,
} from 'open-api-modules/com-api-docs';
import formatSlug from 'src/app/core/utils/format-slug';
import {
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

@Component({
  selector: 'app-tng-loan-determination',
  templateUrl: './tng-loan-determination.component.html',
  styleUrls: ['./tng-loan-determination.component.scss'],
})
export class TngLoanDeterminationComponent
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
  initCollateralImgFile: any;
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
  transitionProcessFee = environment.FIXED_TRANSITION_PROCESS_FEE;

  intervalTime: any;
  disabledBtn: boolean = false;
  countdownTime: number = environment.DEFAULT_DISABLED_BTN_TIME;

  isUpdateLoan: boolean = false;
  currentLoan: PaydayLoan = {};

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
    if (environment.MAINTAIN_TNG) {
      this.router.navigateByUrl('/maintain-company');
      return;
    }
    this.getVoucherList();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  ngAfterViewInit() {
    this.loanDeterminationForm.controls['loanAmount'].setValue(this.minAmount);
    this.loanDeterminationForm.controls['voucherCode'].valueChanges.subscribe((ele)=>{
      if (
        this.loanDeterminationForm.controls['voucherCode'].value === '' &&
        this.isCorrectedVoucherApplied
      ) {
        this.clearDiscount();
      }
    })
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
          if (
            this.customerInfo.personalData.paydayLoanStatus !==
            PAYDAY_LOAN_UI_STATUS.COMPLETED_CDE
          ) {
            return this.router.navigateByUrl('/tng/additional-information');
          }
          this.initAmountSliderValue();
          this.bindingCollateralDocument();
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
    this.applicationControllerService
      .getActivePaydayLoan(this.coreToken, APPLICATION_TYPE.PDL_TNG)
      .subscribe((result: ApiResponsePaydayLoan) => {
        if (result.responseCode === 200) {
          this.currentLoan = result.result;
          if (
            this.currentLoan.status !== PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
          ) {
            return this.router.navigate([
              '/tng/current-loan',
              formatSlug(
                this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
              ),
            ]);
          }
          this.isUpdateLoan = true;
          this.loanDeterminationForm.controls['loanAmount'].setValue(
            this.currentLoan.expectedAmount
          );
          if (this.currentLoan?.voucherTransactionId) {
            this.promotionControllerService
              .getVoucherByTransactionId(this.currentLoan?.voucherTransactionId)
              .subscribe((response: ApiResponseVoucher) => {
                if (!response || response.responseCode !== 200) {
                  return;
                }
                this.loanDeterminationForm.controls['voucherCode'].setValue(
                  response.result.code
                );
                this.checkVoucherApplied();
              });
          }
        }
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

  updateLoanAmount() {
    if (!this.coreToken) {
      return this.showError('common.error', 'common.something_went_wrong');
    }

    // if (
    //   this.loanDeterminationForm.controls.loanAmount.value ===
    //   this.currentLoan.expectedAmount
    // ) {
    //   return this.router.navigate([
    //     '/tng/current-loan',
    //     formatSlug(
    //       this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
    //     ),
    //   ]);
    // }

    const updateLoanAmountRequest: UpdateLoanAmountRequest = {
      customerId: this.customerId,
      applicationType: APPLICATION_TYPE.PDL_TNG,
      expectedAmount: this.loanDeterminationForm.controls.loanAmount.value,
      purpose: this.loanDeterminationForm.controls.loanPurpose.value,
      voucherTransactionId: this.voucherAppliedTransition?.id,
    };

    this.subManager.add(
      this.paydayLoanControllerService
        .updateAmount(this.currentLoan.id, updateLoanAmountRequest)
        .subscribe((response: ApiResponsePaydayLoan) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(response.errorCode);
          }
          return this.router.navigate([
            '/tng/current-loan',
            formatSlug(
              this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        })
    );
  }

  buildApplicationRequest(): CreateApplicationRequest {
    return {
      coreToken: this.coreToken,
      applicationType: APPLICATION_TYPE.PDL_TNG,
      expectedAmount: this.loanDeterminationForm.controls.loanAmount.value,
      purpose: this.loanDeterminationForm.controls.loanPurpose.value,
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
        if (this.isUpdateLoan) {
          return this.updateLoanAmount();
        }
        this.createNewApplication();
      });
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

  get loanAmountFormatMillionPrice() {
    return this.loanDeterminationForm.controls['loanAmount'].value;
  }

  get originalLoanFee() {
    const originalFee =
      this.loanAmountFormatMillionPrice * environment.SERVICE_FEE_RATIO_TNG;
    return originalFee < environment.FIXED_MIN_LOAN_FEE
      ? environment.FIXED_MIN_LOAN_FEE
      : originalFee;
  }

  get vatFee() {
    return (this.originalLoanFee - this.discount) * 0.1;
  }

  get loanFeeTotal() {
    return (
      this.originalLoanFee -
      this.discount +
      this.vatFee +
      this.transitionProcessFee
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
    let millionAnnualIncome = annualIncome / 1000000;
    const percentSalary = millionAnnualIncome * this.getPercentOfSalaryByDay();

    if (percentSalary % 1 >= 0.5) {
      return (Math.round(percentSalary) - 0.5) * 1000000;
    }

    return Math.floor(percentSalary) * 1000000;
  }

  getPercentOfSalaryByDay() {
    let today = moment(new Date(), 'DD/MM/YYYY').format('DD');
    switch (today) {
      case '10':
      case '11':
      case '12':
      case '13':
      case '14':
      case '15':
      case '16':
        return 50.0 / 100;
      case '17':
      case '18':
        return 57.5 / 100;
      case '19':
      case '20':
        return 65.0 / 100;
      case '21':
      case '22':
        return 72.5 / 100;
      default:
        return 80 / 100;
    }
  }

  clearVoucherInput() {
    this.voucherShowError = '';
    this.loanDeterminationForm.controls.voucherCode.setValue('');
    this.clearDiscount()
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
      data: {
        isTng: true,
      },
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
          '/tng/current-loan',
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
