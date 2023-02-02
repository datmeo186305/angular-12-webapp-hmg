import { Component, OnDestroy, OnInit } from '@angular/core';
import formatSlug from '../../../../core/utils/format-slug';
import { PAYDAY_LOAN_STATUS } from '../../../../core/common/enum/payday-loan';
import { Router } from '@angular/router';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import * as fromSelectors from '../../../../core/store';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { Title } from '@angular/platform-browser';
import { CustomerInfoResponse } from '../../../../../../open-api-modules/customer-api-docs';

@Component({
  selector: 'app-sign-contract-success',
  templateUrl: './sign-contract-success.component.html',
  styleUrls: ['./sign-contract-success.component.scss'],
})
export class SignContractSuccessComponent implements OnInit, OnDestroy {
  firstName: string = '';
  loanCode: string = '';

  isSignContractSuccess$: Observable<boolean>;
  isSignContractSuccess: boolean;
  currentLoanCode$: Observable<string>;
  customerInfo$: Observable<CustomerInfoResponse>;

  subManager = new Subscription();

  constructor(
    private router: Router,
    private store: Store<fromStore.State>
  ) //private titleService: Title
  {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Ký hợp đồng thành công' + ' - ' + environment.PROJECT_NAME
    // );
  }

  private _initSubscribeState() {
    this.isSignContractSuccess$ = this.store.select(
      fromSelectors.isSignContractSuccess
    );

    this.currentLoanCode$ = this.store.select(fromSelectors.getCurrentLoanCode);

    this.customerInfo$ = this.store.select(fromSelectors.getCustomerInfoState);

    this.subManager.add(
      this.isSignContractSuccess$.subscribe((isSignContractSuccess) => {
        this.isSignContractSuccess = isSignContractSuccess;
        if (!this.isSignContractSuccess) {
          this.router.navigateByUrl('/hmg/sign-contract');
        }
      })
    );

    this.subManager.add(
      this.currentLoanCode$.subscribe((currentLoanCode) => {
        this.loanCode = currentLoanCode;
      })
    );

    this.subManager.add(
      this.customerInfo$.subscribe((customerInfo) => {
        this.firstName = customerInfo.personalData.firstName;
      })
    );
  }

  redirectToCurrentLoanPage() {
    this.store.dispatch(new fromActions.SetCurrentLoanCode(null));
    this.store.dispatch(new fromActions.SetSignContractSuccess(false));
    return this.router.navigate([
      '/hmg/current-loan',
      formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
    ]);
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowNavigationBar(false));
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
