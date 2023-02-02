import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PAYMENT_METHOD} from "../../../../core/common/enum/payment-method";

@Component({
  selector: 'app-switch-tab-payment-method',
  templateUrl: './switch-tab-payment-method.component.html',
  styleUrls: ['./switch-tab-payment-method.component.scss']
})
export class SwitchTabPaymentMethodComponent implements OnInit {
  @Input() activeTab: PAYMENT_METHOD = PAYMENT_METHOD.TRANSFER;
  @Output() switchTabEvent = new EventEmitter<string>();

  activeTabs: any = PAYMENT_METHOD;

  constructor() {
  }

  ngOnInit(): void {
  }

  switchTab(activeTab) {
    this.switchTabEvent.emit(activeTab);
  }

}
