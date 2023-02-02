import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';

import {NotificationService} from 'src/app/core/services/notification.service';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {
  AdditionalInformationV2Request,
  ApiResponseCustomerInfoResponse,
  ApiResponseListBank,
  Bank,
  BankControllerService,
  CustomerInfoResponse,
  InfoControllerService,
  InfoV2ControllerService,
} from 'open-api-modules/customer-api-docs';
import {ApiResponseObject} from 'open-api-modules/com-api-docs';
import {environment} from 'src/environments/environment';
import * as fromActions from '../../../../core/store';
import {
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
  PL_STEP_NAVIGATION,
} from '../../../../core/common/enum/payday-loan';
import formatSlug from '../../../../core/utils/format-slug';
import * as moment from 'moment';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-vac-additional-information',
  templateUrl: './vac-additional-information.component.html',
  styleUrls: ['./vac-additional-information.component.scss'],
})
export class VacAdditionalInformationComponent
  implements OnInit, AfterViewInit, OnDestroy {
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
        'payday_loan.additional_information.college'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.university'
      ),
      this.multiLanguageService.instant(
        'payday_loan.additional_information.after_university'
      ),
    ],
  };

  employeeType = {
    fieldName: this.multiLanguageService.instant(
      'payday_loan.additional_information.choose_employee_type'
    ),
    options: [
      {
        value: AdditionalInformationV2Request.EmployeeTypeEnum.Factory,
        viewValue: this.multiLanguageService.instant(
          'payday_loan.additional_information.employee_type_factory'
        ),
      },

      {
        value: AdditionalInformationV2Request.EmployeeTypeEnum.Office,
        viewValue: this.multiLanguageService.instant(
          'payday_loan.additional_information.employee_type_office'
        ),
      },
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

  bankOptions: Array<Bank>;
  banksFilterCtrl: FormControl = new FormControl();
  filteredBanks: any[];
  subManager = new Subscription();
  _onDestroy = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private infoV2ControllerService: InfoV2ControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private cdr: ChangeDetectorRef,
    private bankControllerService: BankControllerService
  ) {
    this.additionalInfoForm = this.fb.group({
      maritalStatus: [''],
      educationType: [''],
      borrowerDetailTextVariable1: [''],
      borrowerEmploymentHistoryTextVariable1: [''],
      borrowerEmploymentAverageWage: [''],
      employeeType: [''],
      jobPosition: ['', Validators.required],
      jobType: ['', Validators.required],
      contractExpiration: ['', Validators.required],
      bankCode: ['', Validators.required],
      accountNumber: ['', Validators.required],
    });

    this.initHeaderInfo();
    this._initSubscribeState();
    this._getBankOptions();
  }

  ngOnInit(): void {
    this.subManager.add(
      this.banksFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanks();
        })
    );
  }

  ngAfterViewInit(): void {
    this.getCustomerInfo();
    this.cdr.detectChanges();
  }

  private _initSubscribeState() {
    //declare customer id & core token
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);

    this.subManager.add(
      this.hasActiveLoan$.subscribe((hasActiveLoan) => {
        if (hasActiveLoan) {
          return this.router.navigate([
            '/vac/current-loan',
            formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        }
      })
    );

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
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
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
          this.initAdditionalInfoFormData();
        })
    );
  }

  initAdditionalInfoFormData() {
    this.additionalInfoForm.patchValue({
      maritalStatus: this.customerInfo.personalData.maritalStatus,
      educationType: this.customerInfo.personalData.educationType,
      borrowerDetailTextVariable1:
      this.customerInfo.personalData.borrowerDetailTextVariable1,
      borrowerEmploymentHistoryTextVariable1:
      this.customerInfo.personalData.borrowerEmploymentHistoryTextVariable1,
      borrowerEmploymentAverageWage: this.customerInfo.personalData.annualIncome
        ? this.customerInfo.personalData.annualIncome
        : this.minAmount,
      employeeType: this.customerInfo.personalData?.employeeType,
      jobPosition: this.customerInfo?.employeeData?.workAddress,
      jobType: this.customerInfo?.employeeData?.jobType,
      contractExpiration: this.customerInfo?.employeeData?.contractExpiration,
      bankCode: this.customerInfo?.financialData?.bankCode,
      accountNumber: this.customerInfo?.financialData?.accountNumber,
    });
  }

  private _getBankOptions() {
    this.subManager.add(
      this.bankControllerService
        .getAllBank()
        .subscribe((response: ApiResponseListBank) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(ERROR_CODE_KEY.GET_BANK_LIST_ERROR);
          }
          this.bankOptions = response?.result;
          this.filteredBanks = this.bankOptions;
        })
    );
  }

  filterBanks() {
    let search = this.banksFilterCtrl.value;
    if (!search) {
      this.filteredBanks = this.bankOptions;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks = this.bankOptions.filter(
      (bank) => bank.bankCode.toLowerCase().indexOf(search) > -1 || bank.bankName.toLowerCase().indexOf(search) > -1
    );
  }

  onSubmit() {
    if (!this.additionalInfoForm.valid) return;
    // maping for request api additional Infomation
    const formRawValue = this.additionalInfoForm.getRawValue();
    const additionalInformationV2Request: AdditionalInformationV2Request = {
      maritalStatus: this.additionalInfoForm.controls.maritalStatus.value,
      educationType: this.additionalInfoForm.controls.educationType.value,
      borrowerDetailTextVariable1:
      this.additionalInfoForm.controls.borrowerDetailTextVariable1.value,
      borrowerEmploymentHistoryTextVariable1:
      this.additionalInfoForm.controls.borrowerEmploymentHistoryTextVariable1
        .value,
      annualIncome:
      this.additionalInfoForm.controls.borrowerEmploymentAverageWage.value,
      employeeType: this.additionalInfoForm.controls.employeeType.value,
      workAddress: formRawValue.jobPosition,
      jobType: formRawValue.jobType,
      contractExpiration: formRawValue.contractExpiration,
      bankName: this.bankOptions.find(
        (ele) => ele.bankCode === formRawValue.bankCode
      ).bankName,
      bankCode: formRawValue.bankCode,
      accountNumber: formRawValue.accountNumber,
    };

    this.subManager.add(
      this.infoV2ControllerService
        .additionalInformationV2(additionalInformationV2Request)
        .subscribe((result: ApiResponseObject) => {
          //throw error
          if (!result || result.responseCode !== 200) {
            return this.handleResponseError(result.errorCode);
          }
          this.router.navigateByUrl('/vac/loan-determination');
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

  onValueChange(event) {
    this.additionalInfoForm.controls.borrowerEmploymentAverageWage.setValue(
      event.value
    );
  }
}
