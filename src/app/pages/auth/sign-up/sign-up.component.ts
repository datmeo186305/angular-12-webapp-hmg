import {
  ApiResponseCreateCustomerAccountResponse
} from './../../../../../open-api-modules/identity-api-docs/model/apiResponseCreateCustomerAccountResponse';
import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {NotificationService} from 'src/app/core/services/notification.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
// import { ApiResponseObject } from 'open-api-modules/com-api-docs';
import {
  CreateCustomerAccountRequest,
  CreateVerifiedAccountRequest,
  SignOnMifosControllerService,
} from 'open-api-modules/identity-api-docs';
// import { Title } from '@angular/platform-browser';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {ERROR_CODE_KEY} from '../../../core/common/enum/payday-loan';

// import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  isUsernameInputFocus: boolean = false;
  isPasswordInputFocus: boolean = false;
  isConfirmPasswordInputFocus: boolean = false;

  isPassVisible: boolean = false;
  isConfirmPassVisible: boolean = false;

  ruleAccepted: boolean = false;

  //OTP
  openOtpConfirm: boolean = false;
  otp: any = [];
  mobile: string = '';
  errorText: string = '';
  errorGetTngInfo: boolean = false;
  disabledOTP: boolean = false;
  // isAutoSwitchMethodToCms: boolean = false;

  createCustomerAccountRequestResult: any;

  subManager = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private signOnControllerService:  SignOnMifosControllerService,
    //private titleService: Title,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.signUpForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  ngOnInit(): void {
    // this.titleService.setTitle('Đăng ký' + ' - ' + environment.PROJECT_NAME);
    this.initHeaderInfo();
    this.resetSession();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetNavigationTitle('Đăng ký'));
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  onSubmit() {
    if (!this.signUpForm.valid || !this.ruleAccepted) return;
    this.store.dispatch(
      new fromActions.SetCustomerMobile(
        this.signUpForm.controls.mobileNumber.value
      )
    );
    this.mobile = this.signUpForm.controls.mobileNumber.value;
    this.getOtp();
  }

  getOtp() {
    const createCustomerAccountRequest: CreateCustomerAccountRequest = {
      confirmPassword: this.signUpForm.controls.confirmPassword.value,
      password: this.signUpForm.controls.password.value,
      mobile: this.signUpForm.controls.mobileNumber.value,
      provider: CreateCustomerAccountRequest.ProviderEnum.Cmc
    };
    this.subManager.add(
      this.signOnControllerService
        .createCustomerAccountMifos(createCustomerAccountRequest)
        .subscribe((result: ApiResponseCreateCustomerAccountResponse) => {
          if (result.errorCode != null || result.responseCode !== 200) {
            return this.handleResponseError(result.errorCode);
          }

          this.createCustomerAccountRequestResult = result.result;

          if (this.openOtpConfirm === false) {
            this.openOtpConfirm = true;
          }
        })
    );
  }

  onRuleAccepted() {
    this.ruleAccepted = !this.ruleAccepted;
  }

  //OTP
  verifyOtp(otp) {
    this.errorText = null;
    const requestId = this.createCustomerAccountRequestResult.requestId;
    const signature = this.createCustomerAccountRequestResult.signature;
    const createVerifiedAccountRequest: CreateVerifiedAccountRequest = {
      mobile: this.signUpForm.controls.mobileNumber.value,
      signature: signature,
      requestId: requestId,
      otp: otp,
    };
    this.subManager.add(
      this.signOnControllerService
        .createVerifiedCustomerAccountMifos(createVerifiedAccountRequest)
        .subscribe((result) => {
          if (result.errorCode != null || result.responseCode !== 200) {
            this.errorText = this.multiLanguageService.instant(
              result.errorCode && ERROR_CODE_KEY[result.errorCode]
                ? ERROR_CODE_KEY[result.errorCode]
                : 'common.something_went_wrong'
            );
            this.otp = [];
            return this.handleResponseError(result.errorCode);
          }
          this.store.dispatch(
            new fromActions.SetCustomerMobile(
              createVerifiedAccountRequest.mobile
            )
          );

          this.redirectToSignUpSuccessPage();
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

  resendOtp() {
    this.errorText = null;
    this.otp = [];
    this.getOtp();
  }

  redirectToSignUpSuccessPage() {
    this.router.navigateByUrl('/auth/sign-up-success');
  }
}
