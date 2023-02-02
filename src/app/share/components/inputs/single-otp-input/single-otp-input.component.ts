import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-single-otp-input',
  templateUrl: './single-otp-input.component.html',
  styleUrls: ['./single-otp-input.component.scss']
})
export class SingleOtpInputComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('inputEle') inputEleRef: ElementRef<HTMLInputElement>;

  _value: string;
  get value(): string {
    return this._value;
  }

  @Input() set value(value: string) {
    if (value != this._value) {
      this.model = value;
    }
    this._value = value;
  }


  _focus: boolean = false;
  get focus(): boolean {
    return this._focus;
  }

  @Input() set focus(newValue: boolean) {
    if (newValue && this._focus !== newValue) {
      this.focusElement()
    }
    this._focus = newValue;
  }

  @Input() type: string;
  @Input() separator: string;
  @Input() placeholder: string = '0';
  @Input() displayStatusLine: boolean = false;
  @Input() inputClasses: string;
  @Input() shouldAutoFocus: boolean;
  @Input() inputType: string = 'tel';
  @Input() isLastChild: boolean = false;
  @Input() disabled: boolean = false;

  @Output() onChange = new EventEmitter<string>();
  @Output() onKeydown = new EventEmitter<string>();
  @Output() onPaste = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onBlur = new EventEmitter<string>();


  model: string = "";

  constructor() {
    this.model = this.value;
  }

  ngAfterViewInit(): void {
    if (this.inputEleRef.nativeElement && this.focus && this.shouldAutoFocus) {
      this.inputEleRef.nativeElement.focus();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(changes.value && changes.value.previousValue !== changes.value.currentValue){
    //   this.model = changes.value.currentValue;
    // }
    //
    // console.log(this.inputEleRef)

  }

  ngOnInit(): void {
  }

  focusElement() {
    if (this.inputEleRef) {
      this.inputEleRef.nativeElement.focus();
      this.inputEleRef.nativeElement.select();
    }
  }

  handleOnChange() {
    if (this.model.length > 1) {
      this.model = this.model.slice(0, 1);
    }
    this.onChange.emit(this.model);
  }

  handleOnKeyDown(event) {
    // Only allow characters 0-9, DEL, Backspace and Pasting
    const keyEvent = event || window.event;
    const charCode = keyEvent.which ? keyEvent.which : keyEvent.keyCode;
    if (
      this.isCodeNumeric(charCode) ||
      charCode === 8 ||
      charCode === 86 ||
      charCode === 46
    ) {
      this.onKeydown.emit(event);
    } else {
      keyEvent.preventDefault();
    }
  }

  isCodeNumeric(charCode) {
    // numeric keys and numpad keys
    return (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 96 && charCode <= 105)
    );
  }

  handleOnPaste(event) {
    return this.onPaste.emit(event);
  }

  handleOnFocus() {
    this.inputEleRef.nativeElement.select();
    return this.onFocus.emit("onFocus");
  }

  handleOnBlur() {
    return this.onBlur.emit("onBlur");
  }

}
