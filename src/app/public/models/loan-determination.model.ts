import {PAYDAY_LOAN_TERM_TYPE_VAC} from "../../core/common/enum/payday-loan";

export interface LoanDeterminationModel {
  expectedAmount: number,
  coreToken: string,
  loanPurpose: string,
  voucherCode: string,
  voucherTransactionId: string,
  applicationType: string,
  termType: PAYDAY_LOAN_TERM_TYPE_VAC,
}
