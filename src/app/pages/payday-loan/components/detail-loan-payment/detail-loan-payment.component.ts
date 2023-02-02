import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaydayLoan } from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import { CompanyInfo } from '../../../../../../open-api-modules/customer-api-docs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { PL_LABEL_STATUS } from 'src/app/core/common/enum/label-status';
import {
  PAYDAY_LOAN_STATUS,
  PAYDAY_LOAN_TERM_TYPE_VAC,
} from '../../../../core/common/enum/payday-loan';
import formatSettlementDate from '../../../../core/utils/format-settlement-date';
import formatPunishStartTimeHmg from '../../../../core/utils/format-punish-start-time';
import * as moment from 'moment';

@Component({
  selector: 'pl-detail-loan-payment',
  templateUrl: './detail-loan-payment.component.html',
  styleUrls: ['./detail-loan-payment.component.scss'],
})
export class DetailLoanPaymentComponent implements OnInit {
  @Input() currentLoan: PaydayLoan;
  @Input() companyInfo: CompanyInfo;
  @Input() paidAmount: number;
  @Input() isFinalization: boolean = true;
  @Input() paymentDayRoute = { first: null, second: null, third: null };
  @Output() finalization = new EventEmitter<string>();

  get amountToBePaid() {
    const remainingAmount =
      this.currentLoan.expectedAmount +
      this.currentLoan.latePenaltyPayment -
      this.paidAmount;
    if (!this.isFinalization) {
      if (
        remainingAmount >
        this.lastPaymentRouteAmount + this.paymentRouteAmount
      ) {
        return (
          remainingAmount -
          this.lastPaymentRouteAmount -
          this.paymentRouteAmount
        );
      } else if (remainingAmount > this.lastPaymentRouteAmount) {
        return remainingAmount - this.lastPaymentRouteAmount;
      }
      return remainingAmount;
    }
    return remainingAmount;
  }

  get remainingAmountToBePaid() {
    return (
      this.currentLoan.expectedAmount +
      this.currentLoan.latePenaltyPayment -
      this.paidAmount
    );
  }

  get paymentFee() {
    return (
      (this.currentLoan.expectedAmount *
        environment.FIXED_REPAYMENT_GPAY_DYNAMIC) /
        100 +
      environment.FIXED_REPAYMENT_GPAY_FEE
    );
  }

  get loanStatusContent() {
    if (this.currentLoan.repaymentStatus) {
      if (this.currentLoan.repaymentStatus === 'OVERDUE') {
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
      case PAYDAY_LOAN_STATUS.AUCTION:
        return {
          label: this.multiLanguageService.instant(
            `payday_loan.current_loan.status.${this.currentLoan.status.toLowerCase()}`
          ),
          labelStatus: PL_LABEL_STATUS.PENDING,
        };
      case PAYDAY_LOAN_STATUS.FUNDED:
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
      case PAYDAY_LOAN_STATUS.CONTRACT_AWAITING:
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

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService
  ) {}

  ngOnInit(): void {}

  get settlementDate() {
    if (this.isFinalization) {
      if (!this.currentLoan?.createdAt || !this.currentLoan?.expectedTenure) {
        return;
      }
      return moment(new Date(this.currentLoan?.createdAt))
        .add(this.currentLoan?.expectedTenure, 'days')
        .format('DD/MM/YYYY');
    }

    const remainingAmount =
      this.currentLoan.expectedAmount +
      this.currentLoan.latePenaltyPayment -
      this.paidAmount;

    if (
      remainingAmount >
      this.lastPaymentRouteAmount + this.paymentRouteAmount
    ) {
      return this.paymentDayRoute.first;
    } else if (remainingAmount > this.lastPaymentRouteAmount) {
      return this.paymentDayRoute.second;
    }
    return this.paymentDayRoute.third;
  }

  getPunishStartDay(createdAt, tenure) {
    if (this.companyInfo.groupName === 'HMG') {
      return formatPunishStartTimeHmg(createdAt, tenure);
    }
    return this.formatPunishStartTimeTng();
  }

  finalizationClick() {
    this.finalization.emit('finalization');
  }

  formatPunishStartTimeTng() {
    if (!this.currentLoan.createdAt) {
      return 'N/A';
    }

    const createdDate = new Date(this.currentLoan.createdAt);

    if (this.currentLoan?.termType === PAYDAY_LOAN_TERM_TYPE_VAC.THREE_MONTH) {
      const settlementDate = this.settlementDate;
      return (
        '00h Ngày ' +
        moment(settlementDate, 'DD/MM/yyyy').add(1, 'days').format('DD/MM/YYYY')
      );
    }
    return (
      '00h Ngày ' +
      moment(createdDate)
        .add(this.currentLoan.expectedTenure + 1, 'days')
        .format('DD/MM/YYYY')
    );
  }
}
