import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { Observable, Subscription } from 'rxjs';
import formatSlug from '../../../../core/utils/format-slug';
import { PAYDAY_LOAN_STATUS } from '../../../../core/common/enum/payday-loan';
// import { environment } from 'src/environments/environment';
// import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-contract-terms-success',
  templateUrl: './sign-contract-terms-success.component.html',
  styleUrls: ['./sign-contract-terms-success.component.scss'],
})
export class SignContractTermsSuccessComponent implements OnInit, OnDestroy {
  firstName: '';

  isSignContractTermsSuccess$: Observable<boolean>;
  isSignContractTermsSuccess: boolean;
  hasActiveLoan$: Observable<boolean>;

  subManager = new Subscription();

  constructor(
    private router: Router,
    //private titleService: Title,
    private store: Store<fromStore.State>
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    // this.titleService.setTitle(
    //   'Ký thư chấp thuận thành công' + ' - ' + environment.PROJECT_NAME
    // );
  }

  private _initSubscribeState() {
    this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);
    this.isSignContractTermsSuccess$ = this.store.select(
      fromSelectors.isSignContractTermsSuccess
    );

    this.subManager.add(
      this.hasActiveLoan$.subscribe((hasActiveLoan) => {
        if (hasActiveLoan) {
          return this.router.navigate([
            '/hmg/current-loan',
            formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        }
      })
    );

    this.subManager.add(
      this.isSignContractTermsSuccess$.subscribe(
        (isSignContractTermsSuccess) => {
          this.isSignContractTermsSuccess = isSignContractTermsSuccess;
          if (!this.isSignContractTermsSuccess) {
            this.router.navigateByUrl('/hmg/sign-approval-letter');
          }
        }
      )
    );
  }

  redirectToLoanDetermination() {
    this.store.dispatch(new fromActions.SetSignContractTermsSuccess(false));
    this.router.navigateByUrl('/hmg/loan-determination');
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
