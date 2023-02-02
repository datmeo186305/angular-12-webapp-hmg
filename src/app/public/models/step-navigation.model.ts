import {
  PAYDAY_LOAN_STEP,
  PAYDAY_LOAN_STEP_TITLE,
} from '../../core/common/enum/payday-loan';

export interface StepNavigationInfo {
  currentStep?: PAYDAY_LOAN_STEP;
  lastStep?: PAYDAY_LOAN_STEP;
  stepTitle?: PAYDAY_LOAN_STEP_TITLE;
}
