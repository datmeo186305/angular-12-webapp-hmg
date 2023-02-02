import {
  IllustratingImgDialogComponent
} from './../../components/illustrating-img-dialog/illustrating-img-dialog.component';
import {
  IllustratingSalaryInfoImgDialogComponent
} from './../tng-additional-information/illustrating-salary-info-img-dialog/illustrating-salary-info-img-dialog.component';
import {DOCUMENT_TYPE,} from './../../../../core/common/enum/payday-loan';
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';

import {NotificationService} from 'src/app/core/services/notification.service';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
  InfoV2ControllerService,
} from 'open-api-modules/customer-api-docs';
import {FileControllerService,} from 'open-api-modules/com-api-docs';
import {environment} from 'src/environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import * as fromActions from '../../../../core/store';
import {ERROR_CODE_KEY, PAYDAY_LOAN_STATUS,} from '../../../../core/common/enum/payday-loan';
import formatSlug from '../../../../core/utils/format-slug';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import getUrlExtension from 'src/app/core/utils/get-url-extension';
import urlToFile from 'src/app/core/utils/url-to-file';

@Component({
  selector: 'app-tng-additional-documents',
  templateUrl: './tng-additional-documents.component.html',
  styleUrls: ['./tng-additional-documents.component.scss'],
})
export class TngAdditionalDocumentsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  additionalDocumentsForm: FormGroup;

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

  collateralImgSrc: any;

  initLastMonthSalaryInfoFile: any;

  initFirstMonthSalaryInfoFile: any;

  initCurrentMonthSalaryInfoFile: any;

  initCollateralImgFile: any;

  collateralFile: any;
  originalCollateralFile: any;

  currentYear = moment(new Date()).year();

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
    private sanitizer: DomSanitizer
  ) {
    this.additionalDocumentsForm = this.fb.group({
      lastMonthSalaryInfo: [''],
      firstMonthSalaryInfo: [''],
      currentMonthSalaryInfo: [''],
      collateralInfo: [''],
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
    // this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
    // this.store.dispatch(
    //   new fromActions.SetStepNavigationInfo(
    //     PL_STEP_NAVIGATION.ADDITIONAL_INFORMATION
    //   )
    // );
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
          this.initadditionalDocumentsFormData();
          this.initSalaryInfoImg();
        })
    );
  }

  initadditionalDocumentsFormData() {
    this.additionalDocumentsForm.patchValue({
      maritalStatus: this.customerInfo.personalData.maritalStatus,
      educationType: this.customerInfo.personalData.educationType,
      borrowerDetailTextVariable1:
        this.customerInfo.personalData.borrowerDetailTextVariable1,
      borrowerEmploymentHistoryTextVariable1:
        this.customerInfo.personalData.borrowerEmploymentHistoryTextVariable1,
    });
  }

  onSubmit() {
    if (!this.additionalDocumentsForm.valid) return;

    const fileUpload = [];

    if (
      this.initCollateralImgFile !==
      this.additionalDocumentsForm.controls.collateralInfo.value
    ) {
      fileUpload.push(
        this.documentFileUpload(
          DOCUMENT_TYPE.VEHICLE_REGISTRATION,
          this.additionalDocumentsForm.controls.collateralInfo.value
        )
      );
    }

    if (
      this.initLastMonthSalaryInfoFile !==
      this.additionalDocumentsForm.controls.lastMonthSalaryInfo.value
    ) {
      fileUpload.push(
        this.documentFileUpload(
          DOCUMENT_TYPE.SALARY_INFORMATION_ONE,
          this.additionalDocumentsForm.controls.lastMonthSalaryInfo.value
        )
      );
    }

    if (
      this.initFirstMonthSalaryInfoFile !==
      this.additionalDocumentsForm.controls.firstMonthSalaryInfo.value
    ) {
      fileUpload.push(
        this.documentFileUpload(
          DOCUMENT_TYPE.SALARY_INFORMATION_TWO,
          this.additionalDocumentsForm.controls.firstMonthSalaryInfo.value
        )
      );
    }

    if (
      this.initCurrentMonthSalaryInfoFile !==
      this.additionalDocumentsForm.controls.currentMonthSalaryInfo.value
    ) {
      fileUpload.push(
        this.documentFileUpload(
          DOCUMENT_TYPE.SALARY_INFORMATION_THREE,
          this.additionalDocumentsForm.controls.currentMonthSalaryInfo.value
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
        this.router.navigate([
          '/tng/current-loan',
          formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
        ]);
      });
    }

    return this.router.navigate([
      '/tng/current-loan',
      formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
    ]);
  }

  documentFileUpload(documentType, file) {
    return this.fileControllerService.uploadSingleFile(
      documentType,
      file,
      this.customerId
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
    this.additionalDocumentsForm.controls['lastMonthSalaryInfo'].setValue(
      result.file
    );
    this.lastMonthSalaryInfoSrc = result.imgSrc;
  }

  resultFirstMonthSalaryInfo(result) {
    this.additionalDocumentsForm.controls['firstMonthSalaryInfo'].setValue(
      result.file
    );
    this.firstMonthSalaryInfoSrc = result.imgSrc;
  }

  resultCurrentMonthSalaryInfo(result) {
    this.additionalDocumentsForm.controls['currentMonthSalaryInfo'].setValue(
      result.file
    );
    this.currentMonthSalaryInfoSrc = result.imgSrc;
  }

  resultCollateral(result) {
    this.additionalDocumentsForm.controls['collateralInfo'].setValue(
      result.file
    );
    this.collateralImgSrc = result.imgSrc;
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
            'salary-document-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalDocumentsForm.controls[
              'lastMonthSalaryInfo'
            ].setValue(file);
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
            this.customerInfo?.personalData.salaryDocument2
          );
          let fileName =
            'salary-document-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalDocumentsForm.controls[
              'firstMonthSalaryInfo'
            ].setValue(file);
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
            this.customerInfo?.personalData.salaryDocument3
          );
          let fileName =
            'salary-document-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalDocumentsForm.controls[
              'currentMonthSalaryInfo'
            ].setValue(file);
            this.initCurrentMonthSalaryInfoFile = file;
          });

          this.currentMonthSalaryInfoSrc =
            this.sanitizer.bypassSecurityTrustUrl(url);
        });
    }

    if (this.customerInfo.personalData?.collateralDocument) {
      this.fileControllerService
        .downloadFile({
          documentPath: this.customerInfo.personalData?.collateralDocument,
          customerId: this.customerId,
        })
        .subscribe((result: Blob) => {
          if (!result) return;
          const url = URL.createObjectURL(result);
          // Update old img to upload document in core
          let fileExtension = getUrlExtension(
            this.customerInfo?.personalData.collateralDocument
          );
          let fileName =
            'collateral-document-' + this.customerId + '.' + fileExtension;
          urlToFile(url, fileName, fileExtension).then((file) => {
            this.additionalDocumentsForm.controls['collateralInfo'].setValue(
              file
            );
            this.initCollateralImgFile = file;
          });

          this.collateralImgSrc = this.sanitizer.bypassSecurityTrustUrl(url);
        });
    }
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
}
