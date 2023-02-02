import {ApiResponseObject} from '../../../../../../open-api-modules/customer-api-docs';
import {ContractControllerService, CreateLetterRequest,} from '../../../../../../open-api-modules/com-api-docs';
import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
// @ts-ignore
import {
  ApiResponseApprovalLetter,
  ApiResponseCompanyInfo,
  ApiResponseCustomerInfoResponse,
  ApiResponseListCity,
  ApiResponseListDistrict,
  ApprovalLetterControllerService,
  CityControllerService,
  CompanyControllerService,
  CompanyInfo,
  ConfirmInformationV2Request,
  CustomerInfoResponse,
  DistrictControllerService,
  InfoControllerService,
  InfoV2ControllerService,
} from 'open-api-modules/customer-api-docs';
import {NotificationService} from 'src/app/core/services/notification.service';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {
  ApiResponseBorrowerStepOneResponse,
  BorrowerControllerService,
  BorrowerStepOneInput,
} from 'open-api-modules/core-api-docs';
import * as moment from 'moment';
import * as fromActions from '../../../../core/store';
import {ERROR_CODE_KEY, PAYDAY_LOAN_STATUS, PL_STEP_NAVIGATION,} from '../../../../core/common/enum/payday-loan';
import formatSlug from '../../../../core/utils/format-slug';
// import { LetterControllerService } from 'open-api-modules/contract-api-docs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-vac-confirm-information',
  templateUrl: './vac-confirm-information.component.html',
  styleUrls: ['./vac-confirm-information.component.scss'],
})
export class VacConfirmInformationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  infoForm: FormGroup;
  name: any;
  // cityData: any[];
  // districtData: any[];
  // communeData: any[];
  // filteredCities: any[];
  // filteredDistricts: any[];
  // filteredCommunes: any[];
  // citiesFilterCtrl: FormControl = new FormControl();
  // districtsFilterCtrl: FormControl = new FormControl();
  // communesFilterCtrl: FormControl = new FormControl();

  maxDateTime = moment(new Date(), 'YYYY-MM-DD')
    .subtract(18, 'years')
    .toISOString();

  minDateTime = moment(new Date(), 'YYYY-MM-DD')
    .subtract(70, 'years')
    .toISOString();

  genderOptions = ['Nam', 'Nữ', 'Khác'];
  customerInfo: CustomerInfoResponse;
  coreUserId: string;
  public customerId$: Observable<any>;
  customerId: string;
  public password$: Observable<any>;
  password: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  hasActiveLoan$: Observable<boolean>;

  companyInfo: CompanyInfo;

  subManager = new Subscription();
  _onDestroy = new Subject<void>();

  get disabledInReturnFlow() {
    if (
      !this.customerInfo ||
      !this.customerInfo.personalData ||
      !this.customerInfo.personalData.stepOne
    ) {
      return false;
    }
    return this.customerInfo.personalData.stepOne.toUpperCase() === 'DONE';
  }

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private infoV2ControllerService: InfoV2ControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private borrowerControllerService: BorrowerControllerService,
    private companyControllerService: CompanyControllerService,
    private approvalLetterControllerService: ApprovalLetterControllerService,
    private cityControllerService: CityControllerService,
    private districtControllerService: DistrictControllerService,
    private communeControllerService: CityControllerService,
    private formBuilder: FormBuilder,
    // private letterControllerService: LetterControllerService,
    private contractControllerService: ContractControllerService
  ) {
    this.infoForm = this.formBuilder.group({
      name: [''],
      dateOfBirth: [''],
      gender: [''],
      identityNumberOne: [''],
      idIssuePlace: [''],
      permanentAddress: [''],
      // city: [''],
      // district: [''],
      // commune: [''],
      currentAddress: [''],
      email: ['', Validators.email],
    });

    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    // this.getAllCityList();
    // this.citiesFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCities();
    //   });
    // this.districtsFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterDistricts();
    //   });
    // this.communesFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCommunes();
    //   });
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    this.password$ = this.store.select(fromStore.getPasswordState);
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
      this.password$.subscribe((password) => {
        this.password = password;
      })
    );
    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
      })
    );
  }

  ngAfterViewInit() {
    this.getCustomerInfo();
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

          this.store.dispatch(new fromActions.SetCustomerInfo(response.result));

          this.initConfirmInfoFormData();
          this.getCompanyInfoById(this.customerInfo.personalData.companyId);
          // if (
          //   response.result.personalData?.cityId &&
          //   response.result.personalData?.communeId &&
          //   response.result.personalData?.districtId
          // ) {
          //   this.getDistrictList();
          //   this.getCommuneList();
          // }
        })
    );
  }

  initConfirmInfoFormData() {
    this.infoForm.patchValue({
      name: this.customerInfo.personalData.firstName,
      dateOfBirth: this.formatDateToDisplay(
        this.customerInfo.personalData.dateOfBirth
      ),
      gender: this.customerInfo.personalData.gender,
      identityNumberOne: this.customerInfo.personalData.identityNumberOne,
      idIssuePlace: this.customerInfo.personalData.idIssuePlace,
      permanentAddress: this.customerInfo.personalData.addressTwoLine1,
      // city: this.customerInfo.personalData?.cityId
      //   ? this.customerInfo.personalData?.cityId
      //   : [''],
      // district: this.customerInfo.personalData?.districtId
      //   ? this.customerInfo.personalData?.districtId
      //   : [''],
      // commune: this.customerInfo.personalData?.communeId ? this.customerInfo.personalData?.communeId
      //   : [''],
      // currentAddress: this.customerInfo.personalData.apartmentNumber,
      currentAddress: this.customerInfo.personalData.addressOneLine1,
      email: this.customerInfo.personalData.emailAddress,
    });
  }

  formatDateToDisplay(date) {
    let formatDate = moment(date, ['DD-MM-YYYY', 'DD/MM/YYYY']).format(
      'YYYY-DD-MM HH:mm:ss'
    );
    return moment(formatDate, 'YYYY-DD-MM').toISOString();
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
        PL_STEP_NAVIGATION.CONFIRM_INFORMATION
      )
    );
  }

  onSubmit() {
    if (!this.infoForm.valid) return;
    this.subManager.add(
      this.infoV2ControllerService
        .validateConfirmInformationRequestV2(
          this.buildConfirmInformationRequest()
        )
        .subscribe((result: ApiResponseObject) => {
          if (!result || result.responseCode !== 200) {
            return this.handleResponseError(result?.errorCode);
          }
          this.confirmInformationCustomer();
        })
    );
  }

  confirmInformationCustomer() {
    if (this.customerInfo.personalData.stepOne === 'DONE') {
      this.coreUserId = this.customerInfo.personalData.coreUserId;
      return this.confirmInformation();
    }

    const confirmInformationRequest = this.buildConfirmInformationRequest();

    const borrowerStepOneInput = this.buildStepOneData(
      confirmInformationRequest
    );

    this.subManager.add(
      this.borrowerControllerService
        .borrowerStepOne(borrowerStepOneInput)
        .subscribe((result: ApiResponseBorrowerStepOneResponse) => {
          if (
            !result ||
            result.responseCode !== 200 ||
            result.result?.code == '400'
          ) {
            return this.handleResponseError(result?.errorCode);
          }
          this.store.dispatch(
            new fromActions.SetCoreToken(result.result.access_token)
          );
          this.coreUserId = result.result.userId;
          this.confirmInformation();
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
            return this.handleResponseError(responseCompanyInfo?.errorCode);
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

  confirmInformation() {
    this.subManager.add(
      this.infoV2ControllerService
        .confirmInformationV2(this.buildConfirmInformationRequest())
        .subscribe((result: ApiResponseObject) => {
          if (!result || result.responseCode !== 200) {
            return this.handleResponseError(result.errorCode);
          }

          // this.getLatestApprovalLetter();
          return this.router.navigateByUrl('/vac/additional-information');
        })
    );
  }

  // getLatestApprovalLetter() {
  //   this.subManager.add(
  //     this.approvalLetterControllerService
  //       .getApprovalLetterByCustomerId()
  //       .subscribe((response: ApiResponseApprovalLetter) => {
  //         if (this._isNoValidApprovalLetterYet(response)) {
  //           return this.createApprovalLetter();
  //         }
  //
  //         return this.router.navigateByUrl('/vac/additional-information');
  //       })
  //   );
  // }

  // createApprovalLetter() {
  //   const createLetterRequest: CreateLetterRequest =
  //     this.buildCreateLetterRequest();
  //
  //   this.subManager.add(
  //     this.contractControllerService
  //       .createLetter(COMPANY_NAME.VAC, createLetterRequest)
  //       .subscribe((result) => {
  //         if (!result || result.responseCode !== 200) {
  //           return this.handleResponseError(result.errorCode);
  //         }
  //
  //         this.router.navigateByUrl('/vac/additional-information');
  //       })
  //   );
  // }

  // private _isNoValidApprovalLetterYet(response) {
  //   return (
  //     !this.customerInfo.personalData.approvalLetterId ||
  //     (response.responseCode === 200 && !response.result?.customerSignDone) ||
  //     this._isCustomerInfoHasBeenChanged()
  //   );
  // }

  private _isCustomerInfoHasBeenChanged() {
    return (
      this.customerInfo.personalData.firstName !==
        this.infoForm.controls['name'].value ||
      this.customerInfo.personalData.identityNumberOne !==
        this.infoForm.controls['identityNumberOne'].value ||
      this.customerInfo.personalData.idIssuePlace !==
        this.infoForm.controls['idIssuePlace'].value ||
      this.customerInfo.personalData.dateOfBirth !==
        this.formatTime(this.infoForm.controls['dateOfBirth'].value)
    );
  }

  buildCreateLetterRequest(): CreateLetterRequest {
    return {
      dateOfBirth: this.formatTime(this.infoForm.controls['dateOfBirth'].value),
      name: this.infoForm.controls['name'].value,
      nationalId: this.infoForm.controls['identityNumberOne'].value,
      customerId: this.customerId,
      idIssuePlace: this.infoForm.controls['idIssuePlace'].value,
      company: this.companyInfo.name,
    };
  }

  buildConfirmInformationRequest(): ConfirmInformationV2Request {
    return {
      firstName: this.infoForm.controls['name'].value,
      dateOfBirth: this.formatTime(this.infoForm.controls['dateOfBirth'].value),
      gender: this.infoForm.controls['gender'].value,
      identityNumberSix: this.infoForm.controls['email'].value,
      identityNumberOne: this.infoForm.controls['identityNumberOne'].value,
      addressTwoLine1: this.infoForm.controls['permanentAddress'].value,
      // cityId: this.infoForm.controls.city.value,
      // districtId: this.infoForm.controls.district.value,
      // communeId: this.infoForm.controls.commune.value,
      // apartmentNumber: this.infoForm.controls.currentAddress.value,
      addressOneLine1: this.infoForm.controls.currentAddress.value,
      emailAddress: this.infoForm.controls['email'].value,
      idIssuePlace: this.infoForm.controls['idIssuePlace'].value,
      coreUserId: this.coreUserId,
    };
  }

  buildStepOneData(
    confirmInformationRequest: ConfirmInformationV2Request
  ): BorrowerStepOneInput {
    // const city = this.cityData.filter(
    //   (city) => city.id === this.infoForm.controls.city.value
    // )[0].name;
    // const district = this.districtData.filter(
    //   (district) => district.id === this.infoForm.controls.district.value
    // )[0].name;
    // const commune = this.communeData.filter(
    //   (commune) => commune.id === this.infoForm.controls.commune.value
    // )[0].name;
    // const currentAddress = this.infoForm.controls.currentAddress.value;
    // const fullCurrentAddress = `${currentAddress}, ${commune}, ${district}, ${city}`;
    return {
      customerId: this.customerId,
      password: this.password,
      confirmPassword: this.password,
      mobileNumber: this.customerInfo.personalData.mobileNumber,
      firstName: confirmInformationRequest.firstName,
      dateOfBirth: confirmInformationRequest.dateOfBirth,
      gender: confirmInformationRequest.gender,
      identityNumberOne: confirmInformationRequest.identityNumberOne,
      identityNumberSix: confirmInformationRequest.identityNumberSix,
      emailAddress: confirmInformationRequest.emailAddress,
      //temporary address
      // addressOneLine1: fullCurrentAddress,
      addressOneLine1: this.infoForm.controls.currentAddress.value,
      //permanent address
      addressTwoLine1: confirmInformationRequest.addressTwoLine1,
      //Company Name
      borrowerProfileTextVariable2: this.companyInfo.name,
      //Business company code
      borrowerProfileTextVariable3: this.companyInfo.businessCode,
      //Company director
      borrowerProfileTextVariable4: this.companyInfo.owner,
      //Company Address
      borrowerProfileTextVariable5: this.companyInfo.address,
      //Company phone number
      borrowerProfileTextVariable6: this.companyInfo.mobile,
    };
  }
  // getAllCityList() {
  //   this.subManager.add(
  //     this.cityControllerService
  //       .getAllCity()
  //       .subscribe((result: ApiResponseListCity) => {
  //         if (!result || result.responseCode !== 200) {
  //           return this.handleResponseError(result?.errorCode);
  //         }
  //         this.cityData = result.result;
  //         this.filteredCities = result.result;
  //       })
  //   );
  // }

  // getDistrictList() {
  //   this.subManager.add(
  //     this.cityControllerService
  //       .getDistrictsByCityId(this.infoForm.controls.city.value)
  //       .subscribe((result: ApiResponseListDistrict) => {
  //         if (!result || result.responseCode !== 200) {
  //           return this.handleResponseError(result?.errorCode);
  //         }
  //         this.districtData = result.result;
  //         this.filteredDistricts = result.result;
  //       })
  //   );
  // }

  // getCommuneList() {
  //   this.subManager.add(
  //     this.districtControllerService
  //       .getCommunesByDistrictId(this.infoForm.controls.district.value)
  //       .subscribe((result: ApiResponseListDistrict) => {
  //         if (!result || result.responseCode !== 200) {
  //           return this.handleResponseError(result?.errorCode);
  //         }
  //         this.communeData = result.result;
  //         this.filteredCommunes = result.result;
  //       })
  //   );
  // }

  // changeCity() {
  //   this.getDistrictList();
  //   this.infoForm.patchValue({ district: '' });
  //   this.communeData = [];
  //   this.filteredCommunes = [];
  // }

  // toggleSelect() {
  //   if (!this.infoForm.controls?.city.value) {
  //     return;
  //   }
  //   if (this.filteredCities?.length === 0) {
  //     this.infoForm.patchValue({
  //       city: '',
  //       district: '',
  //       commune: '',
  //     });
  //   }
  //   if (this.filteredDistricts?.length === 0) {
  //     this.infoForm.patchValue({
  //       district: '',
  //       commune: '',
  //     });
  //   }
  //   if (this.filteredCommunes?.length === 0) {
  //     this.infoForm.patchValue({
  //       commune: '',
  //     });
  //   }
  // }

  // filterCities() {
  //   let search = this.citiesFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCities = this.cityData;
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredCities = this.cityData.filter(
  //     (city) => city.name.toLowerCase().indexOf(search) > -1
  //   );
  // }

  // changeCommune() {
  //   this.getCommuneList();
  //   this.infoForm.patchValue({ commune: '' });
  // }

  // filterDistricts() {
  //   let search = this.districtsFilterCtrl.value;
  //   if (!search) {
  //     this.filteredDistricts = this.districtData;
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredDistricts = this.districtData.filter(
  //     (district) => district.name.toLowerCase().indexOf(search) > -1
  //   );
  // }

  // filterCommunes() {
  //   let search = this.communesFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCommunes = this.communeData;
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredCommunes = this.communeData.filter(
  //     (commune) => commune.name.toLowerCase().indexOf(search) > -1
  //   );
  // }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY'
    );
  }
}
