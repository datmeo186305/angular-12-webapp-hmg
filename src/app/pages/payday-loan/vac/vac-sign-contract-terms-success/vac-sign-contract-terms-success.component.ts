import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { Observable, Subscription } from 'rxjs';
import formatSlug from '../../../../core/utils/format-slug';
import { PAYDAY_LOAN_STATUS } from '../../../../core/common/enum/payday-loan';
import { environment } from 'src/environments/environment';
import {
  ApiResponsePaydayLoan,
  CreateApplicationRequest,
  PaydayLoanControllerService,
} from 'open-api-modules/loanapp-tng-api-docs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { PlPromptComponent } from 'src/app/share/components';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vac-sign-contract-terms-success',
  templateUrl: './vac-sign-contract-terms-success.component.html',
  styleUrls: ['./vac-sign-contract-terms-success.component.scss'],
})
export class VacSignContractTermsSuccessComponent implements OnInit, OnDestroy {
  firstName: '';

  isSignContractTermsSuccess$: Observable<boolean>;
  isSignContractTermsSuccess: boolean;
  hasActiveLoan$: Observable<boolean>;

  subManager = new Subscription();

  constructor(
    private router: Router,
    private store: Store<fromStore.State>,
    private paydayLoanControllerService: PaydayLoanControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private promptDialogRef: MatDialogRef<PlPromptComponent>,
    public dialog: MatDialog
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {}

  private _initSubscribeState() {
    this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);
    this.isSignContractTermsSuccess$ = this.store.select(
      fromSelectors.isSignContractTermsSuccess
    );

    this.subManager.add(
      this.hasActiveLoan$.subscribe((hasActiveLoan) => {
        if (hasActiveLoan) {
          return this.router.navigate([
            '/vac/current-loan',
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
            this.router.navigateByUrl('/vac/sign-approval-letter');
          }
        }
      )
    );
  }

  redirectToCurrentLoan() {
   return this.router.navigate([
     '/vac/current-loan',
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
