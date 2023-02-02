import {
  ApiResponseCustomerInfoResponse
} from './../../../../../../open-api-modules/customer-api-docs/model/apiResponseCustomerInfoResponse';
import {InfoControllerService} from './../../../../../../open-api-modules/customer-api-docs/api/infoController.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import {Store} from '@ngrx/store';
import * as fromSelectors from '../../../../core/store/selectors';
import {Observable, Subscription} from 'rxjs';
import formatSlug from '../../../../core/utils/format-slug';
import {PAYDAY_LOAN_STATUS} from '../../../../core/common/enum/payday-loan';
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-tng-sign-contract-terms-success',
  templateUrl: './tng-sign-contract-terms-success.component.html',
  styleUrls: ['./tng-sign-contract-terms-success.component.scss'],
})
export class TngSignContractTermsSuccessComponent implements OnInit, OnDestroy {
  firstName: '';

  isSignContractTermsSuccess$: Observable<boolean>;
  isSignContractTermsSuccess: boolean;
  hasActiveLoan$: Observable<boolean>;
  isSignContractTermsStatus$: Observable<boolean>;

  subManager = new Subscription();

  constructor(
    private router: Router,
    private store: Store<fromStore.State>,
    //private titleService: Title,
    private infoControllerService: InfoControllerService
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    this.checkMaintainTime();
  }

  checkMaintainTime() {
    if (environment.MAINTAIN_TNG) {
      this.router.navigateByUrl('/maintain-company');
    }
  }

  private _initSubscribeState() {
    this.subManager.add(
      this.infoControllerService
        .getInfo()
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (!response.result.personalData.isVerified) {
            this.router.navigateByUrl('/tng/confirm-information');
          }
        })
    );

    this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);
    this.isSignContractTermsSuccess$ = this.store.select(
      fromSelectors.isSignContractTermsSuccess
    );
    this.isSignContractTermsStatus$ = this.store.select(
      fromStore.getIsSignContractTermsStatus
    );

    this.subManager.add(
      this.hasActiveLoan$.subscribe((hasActiveLoan) => {
        if (hasActiveLoan) {
          return this.router.navigate([
            '/tng/current-loan',
            formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        }
      })
    );

    this.subManager.add(
      this.isSignContractTermsStatus$.subscribe((isSignContractTermsStatus) => {
        if (isSignContractTermsStatus) {
          return this.router.navigate(['/tng/additional-information']);
        }
      })
    );

    this.subManager.add(
      this.isSignContractTermsSuccess$.subscribe(
        (isSignContractTermsSuccess) => {
          this.isSignContractTermsSuccess = isSignContractTermsSuccess;
          if (!this.isSignContractTermsSuccess) {
            this.router.navigateByUrl('/tng/sign-approval-letter');
          }
        }
      )
    );
  }

  redirectToAdditionalInformation() {
    this.store.dispatch(new fromActions.SetSignContractTermsSuccess(false));
    this.router.navigateByUrl('/tng/additional-information');
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
