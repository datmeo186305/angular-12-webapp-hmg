import { Component, OnDestroy, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import * as fromActions from '../../../../core/store';
import { NotificationService } from '../../../../core/services/notification.service';
import { Params, Router } from '@angular/router';
import * as fromSelectors from '../../../../core/store/selectors';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import formatSlug from '../../../../core/utils/format-slug';
import {
  GPAY_RESULT_STATUS,
  PAYDAY_LOAN_STATUS,
} from '../../../../core/common/enum/payday-loan';
import { RepaymentControllerService } from '../../../../../../open-api-modules/payment-api-docs';
import base64 from 'base-64';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vac-gpay-payment-result',
  templateUrl: './vac-gpay-payment-result.component.html',
  styleUrls: ['./vac-gpay-payment-result.component.scss'],
})
export class VacGpayPaymentResultComponent implements OnInit, OnDestroy {
  routerQueryParams$: Observable<Params>;
  routerQueryParams: Params;

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private router: Router,
    private notificationService: NotificationService,
    private repaymentControllerService: RepaymentControllerService,
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.callWebHookRepayment();
      this.checkResultData().then((r) => {});
    }, 5000);
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
  }

  private _initSubscribeState() {
    this.routerQueryParams$ = this.store.select(
      fromSelectors.getRouterQueryParams
    );
    this.subManager.add(
      this.routerQueryParams$.subscribe((routerQueryParams) => {
        this.routerQueryParams = routerQueryParams;
      })
    );
  }

  /**
   * Make sure the payment service gets the payment result if gpay doesn't call the webhook
   * @returns {Promise<void>}
   */
  callWebHookRepayment() {
    if (!this.routerQueryParams.data || !this.routerQueryParams.hmac) {
      return;
    }
    //TODO webhook hmg
    this.repaymentControllerService.gpayRepaymentWebhook({
      type: 'PAYMENT_RESULT',
      data: this.routerQueryParams.data,
      hmac: this.routerQueryParams.hmac,
    });
  }

  checkResultData() {
    if (!this.routerQueryParams.data || !this.routerQueryParams.hmac) {
      this.router.navigateByUrl('/home');
      return;
    }
    let dataDecodedBase64 = base64.decode(this.routerQueryParams.data);
    if (!dataDecodedBase64 || !dataDecodedBase64.status) {
      return this.router.navigate([
        '/vac/current-loan',
        formatSlug(PAYDAY_LOAN_STATUS.CALLBACK_PAYMENT_RESULT),
      ]);
    }
    if (dataDecodedBase64.status === GPAY_RESULT_STATUS.ORDER_SUCCESS) {
      return this.router.navigateByUrl('/home');
    }

    this.router.navigate([
      '/vac/current-loan',
      formatSlug(
        dataDecodedBase64.status || PAYDAY_LOAN_STATUS.CALLBACK_PAYMENT_RESULT
      ),
    ]);
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
