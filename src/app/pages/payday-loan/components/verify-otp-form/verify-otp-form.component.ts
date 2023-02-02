import { OtpSendMethodsComponent } from '../otp-send-methods/otp-send-methods.component';
import { MatDialog } from '@angular/material/dialog';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SendLetterOTPRequest } from '../../../../../../open-api-modules/com-api-docs';

@Component({
  selector: 'app-verify-otp-form',
  templateUrl: './verify-otp-form.component.html',
  styleUrls: ['./verify-otp-form.component.scss'],
})
export class VerifyOtpFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() mobile: string;
  @Input() showSubmitButton: boolean = true;
  @Input() errorText: string;
  @Input() otpValue: any = [];
  @Input() disabled: boolean = false;
  @Input() showMethods: boolean = false;
  @Input() currentOtpMethod: SendLetterOTPRequest.OtpTypeEnum =
    SendLetterOTPRequest.OtpTypeEnum.Voice;
  @Output() verifyOtp = new EventEmitter<string>();

  @Output() resendOtp = new EventEmitter<string>();

  @Output() chooseMethodOtp = new EventEmitter<string>();

  verifyOtpForm: FormGroup;

  otp: string;
  disableBtnNext: boolean = true;
  countdownTime: number = environment.RESEND_OTP_COUNTDOWN_TIME;
  intervalTime: any;
  hiddenCountdown: boolean = false;

  @Input()
  get errorSendOtpText(): string {
    return this._errorSendOtpText;
  }
  set errorSendOtpText(newVal: string) {
    this._errorSendOtpText = newVal;
    if (this._errorSendOtpText) {
      this.destroyCountdownTimer();
      this.hiddenCountdown = true;
    }
  }
  private _errorSendOtpText: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.verifyOtpForm = this.formBuilder.group({
      otp: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    if (this.intervalTime) {
      this.destroyCountdownTimer();
      this.hiddenCountdown = true;
    }
    this.countdownTimer(this.countdownTime);
  }

  submit() {
    if (this.disableBtnNext) return;
    this.verifyOtp.emit(this.otp);
  }

  resendOtpClick() {
    this.resendOtp.emit(this.mobile);
    this.otp = null;
    this.resetCountdownTimer();
  }

  resetCountdownTimer() {
    this.hiddenCountdown = false;
    this.countdownTimer(this.countdownTime);
    this.cdr.detectChanges();
  }

  handleOnComplete(value) {
    this.otp = value;
    this.disableBtnNext = false;
    if (!this.showSubmitButton) {
      this.submit();
      return;
    }
    document.getElementById('btn-next-form-signing-otp').focus();
  }

  handleOnChange(value) {
    this.otp = value;
    this.disableBtnNext = true;
  }

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById('signing-otp-countdown-timer').textContent =
        duration.asSeconds() + 's';
      if (duration.asSeconds() == 0) {
        clearInterval(this.intervalTime);
        this.hiddenCountdown = true;
      }
    }, interval);
  }

  destroyCountdownTimer() {
    if (this.intervalTime) {
      clearInterval(this.intervalTime);
    }
  }

  openDialogOtpSendMethods() {
    if (!this.hiddenCountdown) {
      return;
    }
    const dialog = this.dialog.open(OtpSendMethodsComponent, {
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: this.currentOtpMethod,
    });
    dialog
      .afterClosed()
      .subscribe((method: SendLetterOTPRequest.OtpTypeEnum) => {
        if (method) {
          this.currentOtpMethod = method;
          this.resetCountdownTimer();
        }
        this.chooseMethodOtp.emit(method);
      });
  }

  ngOnDestroy(): void {
    this.destroyCountdownTimer();
  }
}
