import { ApiResponsePartnerInfoForm } from './../../../../../../open-api-modules/public-api-docs/model/apiResponsePartnerInfoForm';
import { MultiLanguageService } from './../../../../share/translate/multiLanguageService';
import { NotificationService } from './../../../../core/services/notification.service';
import { PartnerInfoCreateRequest } from './../../../../../../open-api-modules/public-api-docs/model/partnerInfoCreateRequest';
import { SaveInfoControllerService } from './../../../../../../open-api-modules/public-api-docs/api/saveInfoController.service';
// import { environment } from 'src/environments/environment';
// import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import * as fromActions from '../../../../core/store';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  uspList = [
    {
      img: 'assets/img/payday-loan/usp-flexible.png',
      text: 'Giải pháp<br/>linh hoạt',
    },
    {
      img: 'assets/img/payday-loan/usp-guard.png',
      text: 'Đối tác<br/>uy tín',
    },
    {
      img: 'assets/img/payday-loan/usp-ux.png',
      text: 'Trải nghiệm<br/>tối ưu',
    },
    {
      img: 'assets/img/payday-loan/usp-security.png',
      text: 'Bảo mật<br/>minh bạch',
    },
    {
      img: 'assets/img/payday-loan/usp-fast-disbursement.png',
      text: 'Giải ngân<br/>siêu tốc',
    },
    {
      img: 'assets/img/payday-loan/usp-overtech.png',
      text: 'Công nghệ<br/>vượt trội',
    },
  ];

  steps = [
    'Chọn công ty',
    'Định danh điện tử',
    'Xác nhận thông tin',
    'Bổ sung thông tin',
    'Chọn số tiền cần ứng',
    'Ký hợp đồng & nhận giải ngân',
  ];

  partners1 = [
    {
      img: 'assets/img/payday-loan/brands/tng.png',
      text: 'TNG',
    },
    {
      img: 'assets/img/payday-loan/brands/hmg.png',
      text: 'HMG',
    },
    {
      img: 'assets/img/payday-loan/brands/epay.png',
      text: 'Epay',
    },
    {
      img: 'assets/img/payday-loan/brands/alpha.png',
      text: 'Alpha',
    },
    {
      img: 'assets/img/payday-loan/brands/afiex.png',
      text: 'Afiex',
    },
    {
      img: 'assets/img/payday-loan/brands/cmc.png',
      text: 'CMC',
    },
    {
      img: 'assets/img/payday-loan/brands/egofarm.png',
      text: 'Ego Farm',
    },
  ];

  partners2 = [
    {
      img: 'assets/img/payday-loan/brands/vib.png',
      text: 'VIB',
    },
    {
      img: 'assets/img/payday-loan/brands/coffeeHR.png',
      text: 'Coffee HR',
    },
  ];

  companyFieldOptions = [
    {
      viewValue: 'Sản xuất',
      value: 'Sản xuất',
    },
    {
      viewValue: 'Thương mại',
      value: 'Thương mại',
    },
  ];

  staffSizeOptions = [
    {
      viewValue: 'Dưới 100 lao động',
      value: 'Dưới 100 lao động',
    },
    {
      viewValue: '100 đến 500 lao động',
      value: '100 đến 500 lao động',
    },
    {
      viewValue: '500 đến 1000 lao động',
      value: '500 đến 1000 lao động',
    },
    {
      viewValue: '1000 đến 3000 lao động',
      value: '1000 đến 3000 lao động',
    },
    {
      viewValue: '3000 đến 5000 lao động',
      value: '3000 đến 5000 lao động',
    },
    {
      viewValue: 'Trên 5000 lao động',
      value: 'Trên 5000 lao động',
    },
  ];

  contactForm: FormGroup;

  @ViewChildren('input') private inputEle: QueryList<any>;
  @ViewChild('email') private emailInputEle: any;
  @ViewChild('mobile') private mobileInputEle: any;
  @ViewChild('sizeSelect') sizeSelectEle: any;
  @ViewChild('fieldSelect') fieldSelectEle: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private elementRef: ElementRef,
    //private titleService: Title,
    private store: Store<fromStore.State>,
    private saveInfoControllerService: SaveInfoControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.contactForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      companyField: [{ value: '', disabled: false }, Validators.required],
      staffSize: [{ value: '', disabled: false }, Validators.required],
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.errorInputDisplay();
    this.resetSession();
  }

  errorInputDisplay() {
    this.inputEle.forEach((ele) => {
      ele.nativeElement.addEventListener('blur', () => {
        if (!ele.nativeElement.value) {
          ele.nativeElement.style.boxShadow = '0 0 4px red';
        }
      });

      ele.nativeElement.addEventListener('keydown', () => {
        ele.nativeElement.style.boxShadow = 'none';
      });
    });
  }

  onValueChange(ele) {
    ele._elementRef.nativeElement.style.boxShadow = 'none';
  }

  redirectToLogin() {
    this.router.navigateByUrl('/auth/sign-in');
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.inputEle.forEach((ele) => {
        if (!ele.nativeElement.value) {
          ele.nativeElement.style.boxShadow = '0 0 4px #f44336';
        }
      });
      if (this.contactForm.controls.email.errors.email) {
        this.emailInputEle.nativeElement.style.boxShadow = '0 0 4px #f44336';
      }
      if (
        this.contactForm.controls.mobileNumber.value.length != 10 ||
        isNaN(this.contactForm.controls.mobileNumber.value)
      ) {
        this.mobileInputEle.nativeElement.style.boxShadow = '0 0 4px #f44336';
      }
      if (!this.contactForm.controls.companyField.value) {
        this.fieldSelectEle._elementRef.nativeElement.style.boxShadow =
          '0 0 4px #f44336';
      }
      if (!this.contactForm.controls.staffSize.value) {
        this.sizeSelectEle._elementRef.nativeElement.style.boxShadow =
          '0 0 4px #f44336';
      }
      return;
    }

    const partnerInfoCreateRequest: PartnerInfoCreateRequest = {
      fullName: this.contactForm.controls.fullname.value,
      companyName: this.contactForm.controls.companyName.value,
      email: this.contactForm.controls.email.value,
      mobile: this.contactForm.controls.mobileNumber.value,
      companySphere: this.contactForm.controls.companyField.value,
      employeeScale: this.contactForm.controls.staffSize.value,
    };

    this.saveInfoControllerService
      .v1SaveInfoPartnerPost(partnerInfoCreateRequest)
      .subscribe((result: ApiResponsePartnerInfoForm) => {
        if (!result || result.responseCode !== 200) {
          return this.showError(
            'common.something_wrong',
            'common.try_again_late'
          );
        }
        this.notificationService.openSuccessModal({
          title: 'Gửi thông tin thành công',
          content:
            'Chúng tôi sẽ liên hệ tư vấn trong khoảng thời gian sớm nhất.',
          primaryBtnText: 'Đồng ý',
        });

        this.contactForm.reset();
      });
  }

  resetSession() {
    this.store.dispatch(new fromActions.Logout());
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  ngOnDestroy() {}
}
