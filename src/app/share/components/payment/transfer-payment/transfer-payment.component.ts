import { APPLICATION_TYPE, COMPANY_NAME } from './../../../../core/common/enum/payday-loan';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PaymentVirtualAccount } from '../../../../public/models/payment-virtual-account.model';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';
import { PaymentProductInfo } from '../../../../public/models/payment-product-info.model';
import { MatDialog } from '@angular/material/dialog';
import { GuideTransferPaymentDialogComponent } from '../guide-transfer-payment-dialog/guide-transfer-payment-dialog.component';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GpayVirtualAccountControllerService } from '../../../../../../open-api-modules/payment-api-docs';
import * as fromSelectors from '../../../../core/store/selectors';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import { ERROR_CODE_KEY } from '../../../../core/common/enum/payday-loan';
import { NotificationService } from '../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../translate/multiLanguageService';
import * as moment from 'moment';

@Component({
  selector: 'app-transfer-payment',
  templateUrl: './transfer-payment.component.html',
  styleUrls: ['./transfer-payment.component.scss'],
})
export class TransferPaymentComponent implements OnInit, OnDestroy {
  @Input() productInfo: PaymentProductInfo;
  @Input() userInfo: PaymentUserInfo;
  @Input() vaInfo: PaymentVirtualAccount;
  @Input() companyInfo: COMPANY_NAME;
  @Input() applicationType: APPLICATION_TYPE;
  @Output() copiedEvent = new EventEmitter<string>();
  customerId$: Observable<any>;
  customerId: string;

  get amountToBePaid() {
    return (
      this.productInfo.expectedAmount +
      this.productInfo.latePenaltyPayment -
      this.vaInfo.paidAmount
    );
  }

  intervalTime: any;
  disabledBtn: boolean = false;
  countdownTime: number = environment.DEFAULT_DISABLED_BTN_TIME;

  subManager = new Subscription();

  constructor(
    private dialog: MatDialog,
    private gpayVirtualAccountControllerService: GpayVirtualAccountControllerService,
    private store: Store<fromStore.State>,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {
    this.customerId$ = store.select(fromSelectors.getCustomerIdState);

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );
  }

  ngOnInit(): void {}

  copyToClipboard(text) {
    navigator.clipboard.writeText(text ? text.trim().replace('-', '') : '');
    this.copiedEvent.emit('displayCopied');
  }

  copyToClipboardNumber(number) {
    navigator.clipboard.writeText(number);
    this.copiedEvent.emit('displayCopied');
  }

  displayGuideDialog() {
    const dialogRef = this.dialog.open(GuideTransferPaymentDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '360px',
      data: {
        productInfo: this.productInfo,
        userInfo: this.userInfo,
        vaInfo: this.vaInfo,
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
      })
    );
  }

  initPaymentOrder() {
    this.disabledBtn = true;
    this.countdownTimer(this.countdownTime);
    this.createPaymentOrder();
  }

  createPaymentOrder() {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .createPaymentOrder({
          customerId: this.customerId,
          applicationId: this.productInfo.id,
          applicationType: this.applicationType,
        })
        .subscribe((response) => {
          if (
            !response ||
            response.errorCode ||
            response.responseCode !== 200
          ) {
            return this.handleResponseError(response?.errorCode);
          }
          this.displayGuideDialog();
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

  countdownTimer(second) {
    let duration = moment.duration(second * 1000, 'milliseconds');
    let interval = 1000;
    let intervalProcess = (this.intervalTime = setInterval(() => {
      duration = moment.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      document.getElementById('transfer-payment-countdown-timer').textContent =
        '( ' + duration.asSeconds() + 's )';
      if (duration.asSeconds() == 0) {
        clearInterval(intervalProcess);
        this.disabledBtn = false;
      }
    }, interval));
  }

  get productInfoContent() {
    return this.productInfo?.code.replace('-', '');
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
