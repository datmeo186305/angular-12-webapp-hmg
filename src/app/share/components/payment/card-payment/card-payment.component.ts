import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentProductInfo } from '../../../../public/models/payment-product-info.model';
import { environment } from 'src/environments/environment';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';
import * as moment from 'moment';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss'],
})
export class CardPaymentComponent implements OnInit {
  @Input() productInfo: PaymentProductInfo;
  @Input() userInfo: PaymentUserInfo;
  @Input() disabledCardPayment: boolean = false;
  @Output() displayConfirmModalEvent = new EventEmitter<string>();

  get amountToBePaid() {
    return (
      this.productInfo.expectedAmount +
      (this.productInfo.expectedAmount *
        environment.FIXED_REPAYMENT_GPAY_DYNAMIC) /
        100 +
      environment.FIXED_REPAYMENT_GPAY_FEE
    );
  }

  intervalTime: any;
  disabledBtn: boolean = false;
  countdownTime: number = environment.DEFAULT_DISABLED_BTN_TIME;

  constructor() {}

  ngOnInit(): void {}

  finalization() {
    this.disabledBtn = true;
    this.countdownTimer(this.countdownTime);
    this.displayConfirmModalEvent.emit('finalization');
  }

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    let intervalProcess = (this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById('card-payment-countdown-timer').textContent =
        '( ' + duration.asSeconds() + 's )';
      if (duration.asSeconds() == 0) {
        clearInterval(intervalProcess);
        this.disabledBtn = false;
      }
    }, interval));
  }
}
