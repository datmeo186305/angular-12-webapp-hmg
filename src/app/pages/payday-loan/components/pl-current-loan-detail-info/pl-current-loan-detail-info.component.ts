import { ApiResponseListRepaymentTransaction } from './../../../../../../open-api-modules/payment-api-docs/model/apiResponseListRepaymentTransaction';
import { GpayVirtualAccountControllerService } from './../../../../../../open-api-modules/payment-api-docs/api/gpayVirtualAccountController.service';
import { RepaymentControllerService } from './../../../../../../open-api-modules/payment-api-docs/api/repaymentController.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
} from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import {
  GPAY_RESULT_STATUS,
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_TERM_TYPE_VAC,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import { PL_LABEL_STATUS } from 'src/app/core/common/enum/label-status';
import { PaydayLoan } from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import {
  CompanyInfo,
  CustomerInfoResponse,
} from '../../../../../../open-api-modules/customer-api-docs';
import formatSettlementDate from '../../../../core/utils/format-settlement-date';
import formatPunishStartTimeHmg from '../../../../core/utils/format-punish-start-time';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RepaymentTransaction } from 'open-api-modules/payment-api-docs';

@Component({
  selector: 'pl-current-loan-detail-info',
  templateUrl: './pl-current-loan-detail-info.component.html',
  styleUrls: ['./pl-current-loan-detail-info.component.scss'],
})
export class PlCurrentLoanDetailInfoComponent implements OnInit {
  @Input() currentLoan: PaydayLoan;
  @Input() userInfo: CustomerInfoResponse;
  @Input() companyInfo: CompanyInfo;
  @Input() paymentStatus: string;
  @Input() paymentDayRoute = { first: null, second: null, third: null };
  repaymentRouteStatus = {
    first: null,
    second: null,
    third: null,
  };

  @Output() viewContract = new EventEmitter<string>();
  @Output() finalization = new EventEmitter<string>();
  @Output() payment = new EventEmitter<string>();

  disabledBtn: boolean = false;

  get loanStatusContent() {
    if (this.currentLoan.repaymentStatus) {
      if (this.currentLoan.repaymentStatus === REPAYMENT_STATUS.OVERDUE) {
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.repayment_status.${this.currentLoan.repaymentStatus.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.CANCEL,
        };
      }
    }
    switch (this.currentLoan.status) {
      case PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE:
      case PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING:
      case PAYDAY_LOAN_STATUS.INITIALIZED:
      case PAYDAY_LOAN_STATUS.FUNDED:
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
      case PAYDAY_LOAN_STATUS.CONTRACT_ACCEPTED:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.SUCCESS,
        };
      case PAYDAY_LOAN_STATUS.REJECTED:
      case PAYDAY_LOAN_STATUS.WITHDRAW:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
      case PAYDAY_LOAN_STATUS.AWAITING_DISBURSEMENT:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.DISBURSEMENT,
        };
      default:
        return {
          label: this.currentLoan.status,
          labelStatus: PL_LABEL_STATUS.REJECT,
        };
    }
  }

  get showMessageGuideSignContract() {
    return this.currentLoan.status === PAYDAY_LOAN_STATUS.FUNDED;
  }

  get showMessageWaitingEpaySignature() {
    return this.currentLoan.status === PAYDAY_LOAN_STATUS.CONTRACT_AWAITING;
  }

  get showMessageWaitingApproval() {
    return (
      this.currentLoan.status === PAYDAY_LOAN_STATUS.INITIALIZED ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE
    );
  }

  get showMessageGuideCompleteContract() {
    return (
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENTATION_COMPLETE ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.DOCUMENT_AWAITING ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.CONTRACT_AWAITING ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.FUNDED ||
      this.currentLoan.status === PAYDAY_LOAN_STATUS.INITIALIZED
    );
  }

  get showMessagePaymentProcessing() {
    return (
      this.currentLoan.status === PAYDAY_LOAN_STATUS.IN_REPAYMENT &&
      (this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PENDING ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_VERIFYING ||
        this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PROCESSING)
    );
  }

  get disabledBtnFinalization() {
    return (
      this.disabledBtn ||
      this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PENDING ||
      this.paymentStatus === GPAY_RESULT_STATUS.ORDER_VERIFYING ||
      this.paymentStatus === GPAY_RESULT_STATUS.ORDER_PROCESSING
    );
  }

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private router: Router,
    private gpayVirtualAccountControllerService: GpayVirtualAccountControllerService
  ) {}

  ngOnInit(): void {}

  getSettlementDate(createdAt, tenure) {
    return formatSettlementDate(createdAt, tenure);
  }

  getPunishStartDay(createdAt, tenure) {
    if (this.companyInfo.groupName === 'TNG') {
      return this.formatPunishStartTimeTng();
    }
    return formatPunishStartTimeHmg(createdAt, tenure);
  }

  getRepaymentList(loanId) {
    this.subManager.add(
      this.gpayVirtualAccountControllerService
        .getRepaymentTransactionVirtualAccount(loanId)
        .subscribe((response: ApiResponseListRepaymentTransaction) => {
          if (!response || response.responseCode !== 200) {
            this.repaymentRouteStatus.first = 'pending';
            this.repaymentRouteStatus.second = 'notYet';
            this.repaymentRouteStatus.third = 'notYet';
            return;
          }
          const listSuccessTransition = response.result.filter(
            (ele) => ele.status === 'success'
          );
          const amountRepayment = listSuccessTransition.reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.amount,
            0
          );

          const today = moment();
          if (amountRepayment >= this.currentLoan.actualAmount) {
            this.repaymentRouteStatus.first = 'done';
            this.repaymentRouteStatus.second = 'done';
            this.repaymentRouteStatus.third = 'done';
          } else if (amountRepayment >= this.paymentRouteAmount * 2) {
            if (
              today.isBefore(moment(this.paymentDayRoute.second, 'DD/MM/yyyy'))
            ) {
              this.repaymentRouteStatus.first = 'done';
              this.repaymentRouteStatus.second = 'done';
              this.repaymentRouteStatus.third = 'notYet';
            } else {
              this.repaymentRouteStatus.first = 'done';
              this.repaymentRouteStatus.second = 'done';
              this.repaymentRouteStatus.third = 'pending';
            }
          } else if (amountRepayment >= this.paymentRouteAmount) {
            if (
              today.isBefore(moment(this.paymentDayRoute.first, 'DD/MM/yyyy'))
            ) {
              this.repaymentRouteStatus.first = 'done';
              this.repaymentRouteStatus.second = 'notYet';
              this.repaymentRouteStatus.third = 'notYet';
            } else if (
              today.isBefore(moment(this.paymentDayRoute.second, 'DD/MM/yyyy'))
            ) {
              this.repaymentRouteStatus.first = 'done';
              this.repaymentRouteStatus.second = 'pending';
              this.repaymentRouteStatus.third = 'notYet';
            }
          } else {
            this.repaymentRouteStatus.first = 'pending';
            this.repaymentRouteStatus.second = 'notYet';
            this.repaymentRouteStatus.third = 'notYet';
          }
        })
    );
  }

  formatPunishStartTimeTng() {
    if (!this.currentLoan.createdAt) {
      return 'N/A';
    }

    const createdDate = new Date(this.currentLoan.createdAt);
    return (
      '00h Ngày ' +
      moment(createdDate)
        .add(this.currentLoan.expectedTenure + 1, 'days')
        .format('DD/MM/YYYY')
    );
  }

  viewContractTrigger() {
    this.viewContract.emit('viewContract');
  }

  finalizationTrigger() {
    if (this.disabledBtn) return;
    this.finalization.emit('finalization');
  }

  paymentTrigger() {
    if (this.disabledBtn) return;
    this.payment.emit('payment');
  }

  redirectAdditionalInformation() {
    this.router.navigateByUrl(
      `/${this.companyInfo.groupName.toLowerCase()}/additional-information`
    );
  }

  //Tính số tiền thanh toán ở lộ trình 2 tháng đầu
  get paymentRouteAmount() {
    return Math.floor(this.currentLoan.expectedAmount / 1000 / 3) * 1000;
  }

  //Tính số tiền thanh toán ở lộ trình tháng cuối
  get lastPaymentRouteAmount() {
    return (
      (Math.floor(this.currentLoan.expectedAmount / 1000 / 3) +
        ((this.currentLoan.expectedAmount / 1000) % 3)) *
      1000
    );
  }
}
