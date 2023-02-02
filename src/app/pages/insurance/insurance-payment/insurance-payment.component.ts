import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-insurance-payment',
  templateUrl: './insurance-payment.component.html',
  styleUrls: ['./insurance-payment.component.scss']
})
export class InsurancePaymentComponent implements OnInit {
  productInfo: any = {
    message: "MXL-012312"
  };
  userInfo: any = {
    firstName: "Tạ Sơn Quỳnh"
  };
  vaInfo: any = {
    accountNumber: "1234567890",
    amountToBePaid: "66.000 ₫",
    bankCode: "MSB",
    accountName: "TA SON QUYNH"
  };

  constructor() {
  }

  ngOnInit(): void {

  }

}
