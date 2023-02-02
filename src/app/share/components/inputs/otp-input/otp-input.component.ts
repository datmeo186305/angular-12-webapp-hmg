import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  BACKSPACE,
  DELETE,
  LEFT_ARROW,
  RIGHT_ARROW,
} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
})
export class OtpInputComponent implements OnInit {
  @Input() numInputs: number = 4;
  @Input() separator: string = '**';
  @Input() inputClasses: string = '';
  @Input() inputType: string = 'tel';
  @Input() shouldAutoFocus: boolean = false;
  @Input() displayStatusLine: boolean = false;
  @Input() placeholder: string = '0';
  @Input() disabled: boolean = false;

  _value: [];
  get value(): any {
    return this._value;
  }

  @Input() set value(newVal: any) {
    this._value = newVal;
    this.otp = newVal;
  }

  @Output() onChange = new EventEmitter<string>();
  @Output() onComplete = new EventEmitter<string>();

  activeInput: number = 0;
  otp: any = [];
  oldOtp: any = [];

  constructor() {}

  ngOnInit(): void {}

  handleOnFocus(index) {
    this.activeInput = index;
  }

  handleOnBlur() {
    this.activeInput = -1;
  }

  // Helper to return OTP from input
  checkFilledAllInputs() {
    if (this.otp.join('').length === this.numInputs) {
      return this.onComplete.emit(this.otp.join(''));
    }
    return 'Wait until the user enters the required number of characters';
  }

  // Focus on input by index
  focusInput(input) {
    this.activeInput = Math.max(Math.min(this.numInputs - 1, input), 0);
  }

  // Focus on next input
  focusNextInput() {
    this.focusInput(this.activeInput + 1);
  }

  // Focus on previous input
  focusPrevInput() {
    this.focusInput(this.activeInput - 1);
  }

  // Change OTP value at focused input
  changeCodeAtFocus(value) {
    this.oldOtp = Object.assign([], this.otp);
    this.otp[this.activeInput] = value;
    if (this.oldOtp.join('') !== this.otp.join('')) {
      this.onChange.emit(this.otp.join(''));
      this.checkFilledAllInputs();
    }
  }

  // Handle pasted OTP
  handleOnPaste(event) {
    event.preventDefault();
    const pastedData = event.clipboardData
      .getData('text/plain')
      .slice(0, this.numInputs - this.activeInput)
      .split('');
    if (this.inputType === 'number' && !pastedData.join('').match(/^\d+$/)) {
      return 'Invalid pasted data';
    }
    // Paste data from focused input onwards
    const currentCharsInOtp = this.otp.slice(0, this.activeInput);
    const combinedWithPastedData = currentCharsInOtp.concat(pastedData);
    this.otp = combinedWithPastedData.slice(0, this.numInputs);
    this.focusInput(combinedWithPastedData.slice(0, this.numInputs).length);
    return this.checkFilledAllInputs();
  }

  handleOnChange(value) {
    this.changeCodeAtFocus(value);
    this.focusNextInput();
  }

  clearInput() {
    if (this.otp.length > 0) {
      this.onChange.emit('');
    }
    this.otp = [];
    this.activeInput = 0;
  }

  // Handle cases of backspace, delete, left arrow, right arrow
  handleOnKeyDown(event) {
    switch (event.keyCode) {
      case BACKSPACE:
        event.preventDefault();
        this.changeCodeAtFocus('');
        this.focusPrevInput();
        break;
      case DELETE:
        event.preventDefault();
        this.changeCodeAtFocus('');
        break;
      case LEFT_ARROW:
        event.preventDefault();
        this.focusPrevInput();
        break;
      case RIGHT_ARROW:
        event.preventDefault();
        this.focusNextInput();
        break;
      default:
        break;
    }
  }
}
