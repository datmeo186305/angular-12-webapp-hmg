import {APPLICATION_TYPE, DOCUMENT_TYPE, ERROR_CODE,} from './../../../../core/common/enum/payday-loan';
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';

import {NotificationService} from 'src/app/core/services/notification.service';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {
  AdditionalInformationRequest,
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
  InfoV2ControllerService,
} from 'open-api-modules/customer-api-docs';
import {ApiResponseObject, FileControllerService,} from 'open-api-modules/com-api-docs';
import {environment} from 'src/environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import * as fromActions from '../../../../core/store';
import {ERROR_CODE_KEY, PAYDAY_LOAN_STATUS, PL_STEP_NAVIGATION,} from '../../../../core/common/enum/payday-loan';
import formatSlug from '../../../../core/utils/format-slug';
import {MatDialog} from '@angular/material/dialog';
import {
  IllustratingSalaryInfoImgDialogComponent
} from './illustrating-salary-info-img-dialog/illustrating-salary-info-img-dialog.component';
import * as moment from 'moment';
import getUrlExtension from 'src/app/core/utils/get-url-extension';
import urlToFile from 'src/app/core/utils/url-to-file';
import {ApiResponsePaydayLoan, ApplicationControllerService, PaydayLoan,} from 'open-api-modules/loanapp-tng-api-docs';

@Component({
  selector: 'app-tng-additional-information',
  templateUrl: './tng-additional-information.component.html',
  styleUrls: ['./tng-additional-information.component.scss'],
})
export class TngAdditionalInformationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  additionalInfoForm: FormGroup;
  //hardcode
  maritalStatus = {
    fieldName: this.multiLanguageService.instant(
      'payday_loan.additional_information.marital_status'
    ),
    options: [
      this.multiLanguageService.instant(
        'payday_loan.additional_information.single'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.married'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.divorce'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.widow'
      ),
    ],
  };

  educationType = {
    fieldName: this.multiLanguageService.instant(
      'payday_loan.additional_information.educational_status'
    ),
    options: [
      this.multiLanguageService.instant(
        'payday_loan.additional_information.high_school'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.vocational'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.college_university'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.after_university'
      ),
    ],
  };

  borrowerDetailTextVariable1 = {
    fieldName: this.multiLanguageService.instant(
      'payday_loan.additional_information.number_of_dependents'
    ),
    options: [
      {
        value: "0",
        title: "0"
      },
      {
        value: "1",
        title: "1"
      },
      {
        value: "2",
        title: "2"
      },
      {
        value: "3",
        title: "3"
      },
      {
        value: "4",
        title: "4"
      }
    ],
  };

  borrowerEmploymentHistoryTextVariable1 = {
    fieldName: this.multiLanguageService.instant(
      'payday_loan.additional_information.working_time_short'
    ),
    options: [
      this.multiLanguageService.instant(
        'payday_loan.additional_information.less_than_6_months'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.6_months_to_1_year'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.1_year_to_2_years'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.2_years_to_3_years'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.more_than_3_years'
      ),
    ],
  };

  jobType = {
    options: [
      this.multiLanguageService.instant(
        'payday_loan.additional_information.full_time'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.part_time'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.job_work'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.freelancer'
      ),
    ],
  };

  contractExpiration = {
    options: [
      this.multiLanguageService.instant(
        'payday_loan.additional_information.no_contract'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.less_than_one_year'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.one_year_to_two_years'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.more_than_two_years_or_indefinite'
      ),
    ],
  };

  maxAmount: number = environment.ADDITIONAL_INFORMATION_MAX_VALUE;
  minAmount: number = environment.ADDITIONAL_INFORMATION_MIN_VALUE;
  step: number = environment.ADDITIONAL_INFORMATION_STEP_VALUE;

  customerInfo: CustomerInfoResponse;
  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  hasActiveLoan$: Observable<boolean>;
  subManager = new Subscription();

  requiredMonth = {
    salaryDocument1: '',
    salaryDocument2: '',
  };

  lastMonthSalaryInfoSrc: any;

  firstMonthSalaryInfoSrc: any;

  currentMonthSalaryInfoSrc: any;

  initLastMonthSalaryInfoFile: any;

  initFirstMonthSalaryInfoFile: any;

  initCurrentMonthSalaryInfoFile: any;

  currentYear = moment(new Date()).year();

  currentLoan: PaydayLoan = {};
  isUpdateDocument: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private infoV2ControllerService: InfoV2ControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private cdr: ChangeDetectorRef,
    //private titleService: Title,
    public dialog: MatDialog,
    private fileControllerService: FileControllerService,
    private sanitizer: DomSanitizer,
    private applicationControllerService: ApplicationControllerService
  ) {
    this.additionalInfoForm = this.fb.group({
      maritalStatus: [''],
      educationType: [''],
      borrowerDetailTextVariable1: [''],
      borrowerEmploymentHistoryTextVariable1: [''],
      lastMonthSalaryInfo: ['', Validators.required],
      firstMonthSalaryInfo: ['', Validators.required],
      currentMonthSalaryInfo: ['', Validators.required],
      jobPosition: ['', Validators.required],
      jobType: ['', Validators.required],
      contractExpiration: ['', Validators.required],
    });

    this.initHeaderInfo();
    this._initSubscribeState();
    this.initGuideUploadDocument();
  }

  ngOnInit(): void {
    this.checkMaintainTime();
  }

  checkMaintainTime() {
    if (environment.MAINTAIN_TNG) {
      this.router.navigateByUrl('/maintain-company');
    }
  }

  ngAfterViewInit(): void {
    this.getCustomerInfo();
  }

  private _initSubscribeState() {
    //declare customer id & core token
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    // this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);

    // this.subManager.add(
    //   this.hasActiveLoan$.subscribe((hasActiveLoan) => {
    //     if (hasActiveLoan) {
    //       return this.router.navigate([
    //         '/tng/current-loan',
    //         formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
    //       ]);
    //     }
    //   })
    // );

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

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(true));
    this.store.dispatch(
      new fromActions.SetStepNavigationInfo(
        PL_STEP_NAVIGATION.ADDITIONAL_INFORMATION
      )
    );
  }

  getCustomerInfo() {
    //get customer info data
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(response?.errorCode);
          }

          this.customerInfo = response.result;
          this.store.dispatch(new fromActions.SetCustomerInfo(response.result));
          if (!this.customerInfo.personalData.isVerified) {
            return this.router.navigateByUrl('/tng/confirm-information');
          } else if (!this.customerInfo.personalData.isSignedApprovalLetter) {
            return this.router.navigateByUrl('/tng/sign-approval-letter');
          }
          this.getActiveLoan();
          this.initAdditionalInfoFormData();
          // this.initSalaryInfoImg();
        })
    );
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
          if (
            this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING
          ) {
            this.isUpdateDocument = true;
            this.initSalaryInfoImg();
            return;
          }
          return this.router.navigate([
            '/tng/current-loan',
            formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        })
    );
  }

  handleGetActiveLoanError(response) {
    if (
      response.errorCode === ERROR_CODE.DO_NOT_ACTIVE_LOAN_ERROR ||
      ERROR_CODE.LOAN_NOT_EXIST
    ) {
      this.store.dispatch(new fromActions.SetHasActiveLoanStatus(false));
      return;
    }

    this.showError(response.errorCode, response.message);
  }

  initAdditionalInfoFormData() {
    this.additionalInfoForm.patchValue({
      maritalStatus: this.customerInfo.personalData.maritalStatus,
      educationType: this.customerInfo.personalData.educationType,
      borrowerDetailTextVariable1:
        this.customerInfo.personalData.borrowerDetailTextVariable1,
      borrowerEmploymentHistoryTextVariable1:
        this.customerInfo.personalData.borrowerEmploymentHistoryTextVariable1,
      jobPosition: this.customerInfo.employeeData.workAddress,
      jobType: this.customerInfo.employeeData.jobType,
      contractExpiration: this.customerInfo.employeeData.contractExpiration,
    });
  }

  onSubmit() {
    if (!this.additionalInfoForm.valid) return;
    if (this.isUpdateDocument) {
      // maping for request api additional Infomation
      const fileUpload = [];

      if (
        this.initLastMonthSalaryInfoFile !==
        this.additionalInfoForm.controls.lastMonthSalaryInfo.value
      ) {
        fileUpload.push(
          this.fileControllerService.uploadSingleFile(
            DOCUMENT_TYPE.SALARY_INFORMATION_ONE,
            this.additionalInfoForm.controls.lastMonthSalaryInfo.value,
            this.customerId
          )
        );
      }

      if (
        this.initFirstMonthSalaryInfoFile !==
        this.additionalInfoForm.controls.firstMonthSalaryInfo.value
      ) {
        fileUpload.push(
          this.fileControllerService.uploadSingleFile(
            DOCUMENT_TYPE.SALARY_INFORMATION_TWO,
            this.additionalInfoForm.controls.firstMonthSalaryInfo.value,
            this.customerId
          )
        );
      }

      if (
        this.initCurrentMonthSalaryInfoFile !==
        this.additionalInfoForm.controls.currentMonthSalaryInfo.value
      ) {
        fileUpload.push(
          this.fileControllerService.uploadSingleFile(
            DOCUMENT_TYPE.SALARY_INFORMATION_THREE,
            this.additionalInfoForm.controls.currentMonthSalaryInfo.value,
            this.customerId
          )
        );
      }
      if (fileUpload.length > 0) {
        return forkJoin(fileUpload).subscribe((results) => {
          console.log(results);
          results.forEach((result) => {
            if (!result || result['responseCode'] !== 200) {
              return this.handleResponseError(result['errorCode']);
            }
          });
          this.router.navigateByUrl('/tng/loan-determination');
        });
      }
      return this.router.navigateByUrl('/tng/loan-determination');
    }
    this.subManager.add(
      this.infoControllerService
        .uploadSalaryInformationToAzure(
          this.additionalInfoForm.controls.lastMonthSalaryInfo.value,
          this.additionalInfoForm.controls.firstMonthSalaryInfo.value,
          this.additionalInfoForm.controls.currentMonthSalaryInfo.value
        )
        .subscribe((result) => {
          if (!result || result.responseCode !== 200) {
            console.log(result.errorCode, result.message);
            return this.handleResponseError(null);
          }
          this.submitAdditionalDocument();
        })
    );
  }

  submitAdditionalDocument() {
    const formRawValue = this.additionalInfoForm.getRawValue()
    const additionalInformationRequest: AdditionalInformationRequest = {
      maritalStatus: this.additionalInfoForm.controls.maritalStatus.value,
      educationType: this.additionalInfoForm.controls.educationType.value,
      borrowerDetailTextVariable1:
        this.additionalInfoForm.controls.borrowerDetailTextVariable1.value,
      borrowerEmploymentHistoryTextVariable1:
        this.additionalInfoForm.controls.borrowerEmploymentHistoryTextVariable1
          .value,
      workAddress: formRawValue.jobPosition,
      jobType: formRawValue.jobType,
      contractExpiration: formRawValue.contractExpiration,
    };

    this.subManager.add(
      this.infoControllerService
        .additionalInformation(additionalInformationRequest)
        .subscribe((result: ApiResponseObject) => {
          //throw error
          if (!result || result.responseCode !== 200) {
            console.log(result.errorCode, result.message);
            return this.handleResponseError(null);
          }
          // redirect to loan detemination
          this.router.navigateByUrl('/tng/loan-determination');
        })
    );
  }

  handleResponseError(errorCode: string) {
    return this.showError(
      'common.error',
      errorCode ? ERROR_CODE_KEY[errorCode] : 'common.something_went_wrong'
    );
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  openExample() {
    const dialogRef = this.dialog.open(
      IllustratingSalaryInfoImgDialogComponent,
      {
        autoFocus: false,
        panelClass: 'custom-dialog-container',
      }
    );
  }

  resultLastMonthSalaryInfo(result) {
    this.additionalInfoForm.controls['lastMonthSalaryInfo'].setValue(
      result.file
    );
    this.lastMonthSalaryInfoSrc = result.imgSrc;
  }

  resultFirstMonthSalaryInfo(result) {
    this.additionalInfoForm.controls['firstMonthSalaryInfo'].setValue(
      result.file
    );
    this.firstMonthSalaryInfoSrc = result.imgSrc;
  }

  resultCurrentMonthSalaryInfo(result) {
    this.additionalInfoForm.controls['currentMonthSalaryInfo'].setValue(
      result.file
    );
    this.currentMonthSalaryInfoSrc = result.imgSrc;
  }

  initGuideUploadDocument() {
    if (moment(new Date()).get('date') >= 10) {
      this.requiredMonth = {
        salaryDocument1: moment(new Date()).subtract(1, 'month').format('M'),
        salaryDocument2: moment(new Date()).subtract(2, 'month').format('M'),
      };

      return;
    }
    this.requiredMonth = {
      salaryDocument1: moment(new Date()).subtract(2, 'month').format('M'),
      salaryDocument2: moment(new Date()).subtract(3, 'month').format('M'),
    };
  }

  downloadFile(path, endSrc) {
    let url;
    this.fileControllerService
      .downloadFile({
        documentPath: path,
        customerId: this.customerId,
      })
      .subscribe(
        (result: Blob) => {
          if (!result) return;
          url = URL.createObjectURL(result);
        },
        (error) => {},
        () => {
          endSrc = this.sanitizer.bypassSecurityTrustUrl(url);
        }
      );
  }

  async initSalaryInfoImg() {
    if (this.customerInfo.personalData?.salaryDocument1) {
      this.fileControllerService
        .downloadFile({
          documentPath: this.customerInfo.personalData?.salaryDocument1,
          customerId: this.customerId,
        })
        .subscribe((result: Blob) => {
          if (!result) return;
          const url = URL.createObjectURL(result);
          // Update old img to upload document in core
          let fileExtension = getUrlExtension(
            this.customerInfo?.personalData.salaryDocument1
          );
          let fileName =
            'lastMonthSalaryInfo-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalInfoForm.controls['lastMonthSalaryInfo'].setValue(
              file
            );
            this.initLastMonthSalaryInfoFile = file;
          });

          this.lastMonthSalaryInfoSrc =
            this.sanitizer.bypassSecurityTrustUrl(url);
        });
    }

    if (this.customerInfo.personalData?.salaryDocument2) {
      this.fileControllerService
        .downloadFile({
          documentPath: this.customerInfo.personalData?.salaryDocument2,
          customerId: this.customerId,
        })
        .subscribe((result: Blob) => {
          if (!result) return;
          const url = URL.createObjectURL(result);
          // Update old img to upload document in core
          let fileExtension = getUrlExtension(
            this.customerInfo?.personalData.salaryDocument1
          );
          let fileName =
            'firstMonthSalaryInfo-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalInfoForm.controls['firstMonthSalaryInfo'].setValue(
              file
            );
            this.initFirstMonthSalaryInfoFile = file;
          });

          this.firstMonthSalaryInfoSrc =
            this.sanitizer.bypassSecurityTrustUrl(url);
        });
    }

    if (this.customerInfo.personalData?.salaryDocument3) {
      this.fileControllerService
        .downloadFile({
          documentPath: this.customerInfo.personalData?.salaryDocument3,
          customerId: this.customerId,
        })
        .subscribe((result: Blob) => {
          if (!result) return;
          const url = URL.createObjectURL(result);
          // Update old img to upload document in core
          let fileExtension = getUrlExtension(
            this.customerInfo?.personalData.salaryDocument1
          );
          let fileName =
            'currentMonthSalaryInfo-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalInfoForm.controls['currentMonthSalaryInfo'].setValue(
              file
            );
            this.initCurrentMonthSalaryInfoFile = file;
          });

          this.currentMonthSalaryInfoSrc =
            this.sanitizer.bypassSecurityTrustUrl(url);
        });
    }
  }
}
