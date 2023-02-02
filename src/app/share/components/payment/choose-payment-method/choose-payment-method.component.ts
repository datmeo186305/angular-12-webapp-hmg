import { APPLICATION_TYPE, COMPANY_NAME } from './../../../../core/common/enum/payday-loan';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MultiLanguageService } from '../../../translate/multiLanguageService';
import { PAYMENT_METHOD } from '../../../../core/common/enum/payment-method';
import { PaymentProductInfo } from '../../../../public/models/payment-product-info.model';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';
import { PaymentVirtualAccount } from '../../../../public/models/payment-virtual-account.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { Subscription } from 'rxjs';
import {BUTTON_TYPE} from "../../../../core/common/enum/prompt";

@Component({
  selector: 'app-choose-payment-method',
  templateUrl: './choose-payment-method.component.html',
  styleUrls: ['./choose-payment-method.component.scss'],
})
export class ChoosePaymentMethodComponent implements OnInit {
  @Input() productInfo: PaymentProductInfo;
  @Input() userInfo: PaymentUserInfo;
  @Input() vaInfo: PaymentVirtualAccount;
  @Input() companyInfo: COMPANY_NAME;
  @Input() applicationType: APPLICATION_TYPE;

  @Output() submitFinalization = new EventEmitter<any>();

  disabledCardPayment: boolean = false;
  showCopied: boolean = false;
  activeTab: PAYMENT_METHOD = PAYMENT_METHOD.TRANSFER;
  activeTabs: any = PAYMENT_METHOD;
  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  switchTab($event) {
    this.activeTab = $event;
  }

  displayConfirmModalEvent($event) {
    let promptDialogRef = this.notificationService.openPrompt({
      imgUrl: 'assets/img/icon/group-3/svg/info.svg',
      imgBackgroundClass: 'notification-info-img',
      title: this.multiLanguageService.instant('common.notification'),
      content: this.multiLanguageService.instant(
        'payment.choose_payment_method.confirm_finalization_content',
        { minute: 10 }
      ),
      primaryBtnText: this.multiLanguageService.instant(
        'payment.guide_transfer.understand'
      ),
      secondaryBtnText: this.multiLanguageService.instant('common.close'),
    });

    this.subManager.add(
      promptDialogRef.afterClosed().subscribe((buttonType: BUTTON_TYPE) => {
        if (buttonType === BUTTON_TYPE.PRIMARY) {
          this.submitFinalization.emit(true)
        }
      })
    );
  }

  displayCopied($event) {
    this.showCopied = true;
    setTimeout(() => {
      this.showCopied = false;
    }, 3000);
  }
}
