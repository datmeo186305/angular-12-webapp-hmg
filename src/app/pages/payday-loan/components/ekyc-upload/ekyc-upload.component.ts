import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from './../../../../core/store';
import {
  ApiResponseKalapaResponse, KalapaControllerService,
  KalapaV2ControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import { NotificationService } from '../../../../core/services/notification.service';
import { Prompt } from '../../../../public/models/prompt.model';
import { PlPromptComponent } from '../../../../share/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ekyc-upload',
  templateUrl: './ekyc-upload.component.html',
  styleUrls: ['./ekyc-upload.component.scss'],
})
export class EkycUploadComponent implements OnInit, AfterViewInit {
  ekycForm: FormGroup;

  customerId: string;
  customerId$: Observable<string>;

  _customerInfo: any;
  get customerInfo(): any {
    return this._customerInfo;
  }

  @Input() set customerInfo(newVal: any) {
    if (newVal != this._customerInfo) {
      this.initValue = {
        frontID: newVal.frontId,
        backID: newVal.backId,
        selfie: newVal.selfie,
      };
      this.frontID = newVal.frontId;
      this.backID = newVal.backId;
      this.selfie = newVal.selfie;
    }
    this._customerInfo = newVal;
  }

  get disabledBtn(): boolean {
    return (
      !this.params.frontIdentityCardImg ||
      !this.params.backIdentityCardImg ||
      !this.params.selfieImg
    );
  }

  @Output() redirectToConfirmInformationPage = new EventEmitter<string>();
  @Output() completeEkyc = new EventEmitter<any>();

  params: any = {
    frontIdentityCardImg: null,
    backIdentityCardImg: null,
    selfieImg: null,
  };
  initValue: any = {
    frontID: null,
    backID: null,
    selfie: null,
  };
  frontID: any = null;
  backID: any = null;
  selfie: any = null;

  subManager = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private kalapaService: KalapaControllerService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {
    this.customerId$ = store.select(fromSelectors.getCustomerIdState);

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    this.ekycForm = this.formBuilder.group({
      frontID: ['', [Validators.required]],
      backID: ['', [Validators.required]],
      selfie: ['', [Validators.required]],
    });
  }

  resultFrontIdCard(result) {
    this.params.frontIdentityCardImg = result.file;
    this.frontID = result.imgSrc;
  }

  resultBackIdCard(result) {
    this.params.backIdentityCardImg = result.file;
    this.backID = result.imgSrc;
  }

  resultSelfie(result) {
    this.params.selfieImg = result.file;
    this.selfie = result.imgSrc;
  }

  onSubmit() {
    if (
      this.initValue.frontID != null &&
      this.initValue.backID != null &&
      this.initValue.selfie != null &&
      this.initValue.frontID === this.frontID &&
      this.initValue.backID === this.backID &&
      this.initValue.selfie === this.selfie
    ) {
      this.redirectToConfirmInformationPage.emit(
        'redirectToConfirmInformationPage'
      );
      return;
    }

    if (
      !this.params.frontIdentityCardImg ||
      !this.params.backIdentityCardImg ||
      !this.params.selfieImg
    )
      return;

    this.notificationService.showLoading({ showContent: true });
    this.subManager.add(
      this.kalapaService
        .extractInfo(
          this.params.frontIdentityCardImg,
          this.params.selfieImg,
          this.params.backIdentityCardImg,
          false,
        )
        .subscribe(
          (ekycResponse: ApiResponseKalapaResponse) => {
            if (!ekycResponse.result || ekycResponse.responseCode !== 200) {
              this.handleEkycError(ekycResponse);
            }

            this.completeEkyc.emit({
              result: ekycResponse.result,
              params: this.params,
            });
          },
          (error) => {
            console.log('onSubmit error');
          },
          () => {
            this.notificationService.hideLoading();
          }
        )
    );
  }

  handleEkycError(ekycInfo) {
    if (ekycInfo.responseCode !== 200) {
      this.showErrorModal({
        title: this.multiLanguageService.instant(
          'payday_loan.ekyc.ekyc_failed_title'
        ),
        content: this.multiLanguageService.instant(
          'payday_loan.ekyc.ekyc_failed_content'
        ),
        primaryBtnText: this.multiLanguageService.instant('common.confirm'),
        imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
      });
      return;
    }

    this.showErrorModal({
      title: this.multiLanguageService.instant('common.notification'),
      content: this.multiLanguageService.instant('common.something_went_wrong'),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
      imgUrl: 'assets/img/payday-loan/warning-prompt-icon.png',
    });
  }

  showErrorModal(payload: Prompt, imgUrl?: string) {
    let promptDialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '330px',
      data: {
        imgBackgroundClass: payload?.imgBackgroundClass
          ? payload?.imgBackgroundClass + ' text-center'
          : 'text-center',
        imgUrl: !payload?.imgGroupUrl ? payload?.imgUrl || imgUrl : null,
        imgGroupUrl: payload?.imgGroupUrl || null,
        title: payload?.title,
        content: payload?.content,
        primaryBtnText: payload?.primaryBtnText,
        secondaryBtnText: payload?.secondaryBtnText,
      },
    });

    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((confirmed: boolean) => {
        this.resetParams();
        this.subManager.unsubscribe();
      })
    );
  }

  resetParams() {
    this.params = {
      frontIdentityCardImg: null,
      backIdentityCardImg: null,
      selfieImg: null,
    };
    this.frontID = null;
    this.backID = null;
    this.selfie = null;
  }

  ngAfterViewInit(): void {}
}
