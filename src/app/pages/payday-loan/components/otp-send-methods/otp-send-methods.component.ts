import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Output, Input, Inject } from '@angular/core';
import { SendLetterOTPRequest } from '../../../../../../open-api-modules/com-api-docs';

@Component({
  selector: 'app-otp-send-methods',
  templateUrl: './otp-send-methods.component.html',
  styleUrls: ['./otp-send-methods.component.scss'],
})
export class OtpSendMethodsComponent implements OnInit {
  currentMethod: SendLetterOTPRequest.OtpTypeEnum =
    SendLetterOTPRequest.OtpTypeEnum.Sms;
  otpMethods = SendLetterOTPRequest.OtpTypeEnum;

  constructor(
    private dialogRef: MatDialogRef<OtpSendMethodsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendLetterOTPRequest.OtpTypeEnum
  ) {
    this.currentMethod = data;
  }

  ngOnInit(): void {
  }

  methodSelected(method: SendLetterOTPRequest.OtpTypeEnum) {
    this.currentMethod = method;
    this.dialogRef.close(method);
  }
}
