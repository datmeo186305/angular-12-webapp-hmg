import {PersonalData} from './../../../../../../open-api-modules/customer-api-docs/model/personalData';
import {APPLICATION_TYPE} from './../../../../core/common/enum/payday-loan';
import {CompanyInfo} from './../../../../../../open-api-modules/customer-api-docs/model/companyInfo';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  ApiResponseCustomerInfoResponse,
  ApiResponseListCompanyInfo,
  CompanyControllerService,
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import {
  ApiResponsePaydayLoan,
  ApiResponsePaydayLoan as TngApiResponsePaydayLoan,
  ApplicationControllerService as TngApplicationControllerService,
  MifosPaydayLoanControllerService,
} from 'open-api-modules/loanapp-tng-api-docs';
import {Observable, Subscription} from 'rxjs';
import {COMPANY_NAME, PAYDAY_LOAN_STATUS,} from 'src/app/core/common/enum/payday-loan';
import {NotificationService} from 'src/app/core/services/notification.service';
import formatSlug from 'src/app/core/utils/format-slug';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
// import { Title } from '@angular/platform-browser';
// import { environment } from 'src/environments/environment';
import * as fromStore from 'src/app/core/store';
import * as fromActions from 'src/app/core/store';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.scss'],
})
export class CompaniesListComponent implements OnInit, OnDestroy {
  companiesList = [];

  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  subManager = new Subscription();

  customerInfo: CustomerInfoResponse;
  isSignContractTermsStatus$: Observable<boolean>;

  applicationType: string;

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private tngApplicationControllerService: TngApplicationControllerService,
    private mifosPaydayLoanControllerService: MifosPaydayLoanControllerService,
    private companyControllerService: CompanyControllerService //private titleService: Title
  ) {
    this._initSubscribeState();
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Chọn công ty' + ' - ' + environment.PROJECT_NAME
    // );
    this.initHeaderInfo();
    this.getCustomerInfo();
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
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(
      new fromActions.SetNavigationTitle(
        this.multiLanguageService.instant('payday_loan.choose_company')
      )
    );
  }

  getCustomerInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((result: ApiResponseCustomerInfoResponse) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          this.customerInfo = result?.result;
          if (this.customerInfo?.personalData?.companyId) {
            return this.getActiveLoan(
              this.customerInfo?.personalData?.companyGroupName
            );
          }
          return this.getListCompany();
        })
    );
  }

  getActiveLoan(companyGroupName) {
    if (companyGroupName === COMPANY_NAME.HMG) {
      return this.getActiveLoanHmg();
    }
    return this.getActiveLoanTng();
  }

  getActiveLoanHmg() {
    // if (!this.coreToken) {
    //   return this.getListCompany();
    // }
    this.subManager.add(
      this.mifosPaydayLoanControllerService
        .getActivePaydayLoanMifos(this.customerId, APPLICATION_TYPE.PDL_HMG)
        .subscribe((result: ApiResponsePaydayLoan) => {
          if (!result || result.responseCode !== 200) {
            return this.getListCompany();
          }
          this.store.dispatch(new fromActions.SetHasActiveLoanStatus(true));
          return this.router.navigate([
            '/hmg/current-loan',
            formatSlug(
              result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        })
    );
  }

  getActiveLoanTng() {
    if (!this.coreToken) {
      if (this.customerInfo?.personalData?.companyGroupName == COMPANY_NAME.TNG) {
        if (environment.MAINTAIN_TNG) {
          this.router.navigateByUrl('/maintain-company');
          return;
        }
      }
      return this.getListCompany();
    }
    //OTHER
    switch (this.customerInfo?.personalData?.companyGroupName) {
      case COMPANY_NAME.TNG:
        this.applicationType = APPLICATION_TYPE.PDL_TNG;
        break;

      case COMPANY_NAME.VAC:
        if (
          this.customerInfo.personalData?.employeeType ===
          PersonalData.EmployeeTypeEnum.Factory
        ) {
          this.applicationType = APPLICATION_TYPE.PDL_VAC_FACTORY;
        } else {
          this.applicationType = APPLICATION_TYPE.PDL_VAC_OFFICE;
        }
        break;

      default:
        this.customerInfo.personalData.companyGroupName = COMPANY_NAME.TNG;
        this.applicationType = APPLICATION_TYPE.PDL_TNG;
        break;
    }

    this.subManager.add(
      this.tngApplicationControllerService
        .getActivePaydayLoan(this.customerId, this.applicationType)
        .subscribe((result: TngApiResponsePaydayLoan) => {
          if (!result || result.responseCode !== 200) {
            if (this.customerInfo?.personalData?.companyGroupName == COMPANY_NAME.TNG) {
              if (environment.MAINTAIN_TNG) {
                this.router.navigateByUrl('/maintain-company');
                return;
              }
            }
            return this.getListCompany();
          }
          this.store.dispatch(new fromActions.SetHasActiveLoanStatus(true));
          return this.router.navigate([
            `/${this.customerInfo.personalData?.companyGroupName.toLowerCase()}/current-loan`,
            formatSlug(
              result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        })
    );
  }

  getListCompany() {
    this.subManager.add(
      this.companyControllerService
        .getListCompanies()
        .subscribe((result: ApiResponseListCompanyInfo) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          this.companiesList = result.result;
        })
    );
  }

  chooseCompany(company: CompanyInfo) {
    this.subManager.add(
      this.infoControllerService
        .chooseCompany({companyId: company.id})
        .subscribe((result) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          return this.router.navigateByUrl(
            `/${company.groupName.toLocaleLowerCase()}/ekyc`
          );
        })
    );
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
