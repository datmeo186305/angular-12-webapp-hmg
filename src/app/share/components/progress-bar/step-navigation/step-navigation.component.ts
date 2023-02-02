import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StepNavigationInfo } from '../../../../public/models/step-navigation.model';
import {
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_STEP_TITLE,
} from '../../../../core/common/enum/payday-loan';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import * as fromSelectors from '../../../../core/store/selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-navigation',
  templateUrl: './step-navigation.component.html',
  styleUrls: ['./step-navigation.component.scss'],
})
export class StepNavigationComponent implements OnInit {
  stepNavigationInfo$: Observable<StepNavigationInfo>;

  stepNavigationInfo: StepNavigationInfo = {
    currentStep: PAYDAY_LOAN_STEP.ELECTRONIC_IDENTIFIERS,
    lastStep: PAYDAY_LOAN_STEP.CONTRACT_SIGNING,
    stepTitle: PAYDAY_LOAN_STEP_TITLE.ELECTRONIC_IDENTIFIERS,
  };

  subManager = new Subscription();

  constructor(private store: Store<fromStore.State>) {
    this._subscribeHeaderInfo();
  }

  ngOnInit(): void {}

  private _subscribeHeaderInfo() {
    this.stepNavigationInfo$ = this.store.select(
      fromSelectors.getStepNavigationInfo
    );
    this.subManager.add(
      this.stepNavigationInfo$.subscribe(
        (stepNavigationInfo: StepNavigationInfo) => {
          this.stepNavigationInfo = stepNavigationInfo;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
