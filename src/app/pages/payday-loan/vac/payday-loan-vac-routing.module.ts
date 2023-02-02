import { NotFoundComponent } from './../../errors/not-found/not-found.component';
import { TitleConstants } from './../../../core/common/title-constants';
import { VacGpayPaymentResultComponent } from './vac-gpay-payment-result/vac-gpay-payment-result.component';
import { VacSignContractSuccessComponent } from './vac-sign-contract-success/vac-sign-contract-success.component';
import { VacCurrentLoanComponent } from './vac-current-loan/vac-current-loan.component';
import { VacLoanDeterminationComponent } from './vac-loan-determination/vac-loan-determination.component';
import { VacSignContractTermsSuccessComponent } from './vac-sign-contract-terms-success/vac-sign-contract-terms-success.component';
import { VacSignContractTermsOfServiceComponent } from './vac-sign-contract-terms-of-service/vac-sign-contract-terms-of-service.component';
import { VacAdditionalInformationComponent } from './vac-additional-information/vac-additional-information.component';
import { VacConfirmInformationComponent } from './vac-confirm-information/vac-confirm-information.component';
import { VacEkycComponent } from './vac-ekyc/vac-ekyc.component';
import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';
import { Routes } from '@angular/router';
import { VacSignContractComponent } from './vac-sign-contract/vac-sign-contract.component';
import { VacLoanPaymentComponent } from './vac-loan-payment/vac-loan-payment.component';
import { VacPlChoosePaymentMethodComponent } from './vac-pl-choose-payment-method/vac-pl-choose-payment-method.component';
import { VacLoanStepPaymentComponent } from './vac-loan-step-payment/vac-loan-step-payment.component';

export const PaydayLoanVacRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ekyc',
        component: VacEkycComponent,
        data: { animation: true, title: TitleConstants.TITLE_VALUE.EKYC },
        canActivate: [AuthGuard],
      },
      {
        path: 'confirm-information',
        component: VacConfirmInformationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CONFIRM_INFORMATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter',
        component: VacSignContractTermsOfServiceComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_APPROVAL_LETTER,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter-success',
        component: VacSignContractTermsSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_APPROVAL_LETTER_SUCCESS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-information',
        component: VacAdditionalInformationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.ADDITIONAL_INFORMATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-determination',
        component: VacLoanDeterminationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_DETERMINATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'current-loan/:status',
        component: VacCurrentLoanComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CURRENT_LOAN,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract',
        component: VacSignContractComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_CONTRACT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract-success',
        component: VacSignContractSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_CONTRACT_SUCCESS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-payment',
        component: VacLoanPaymentComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_PAYMENT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-step-payment',
        component: VacLoanStepPaymentComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_STEP_PAYMENT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'choose-payment-method',
        component: VacPlChoosePaymentMethodComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CHOOSE_PAYMENT_METHOD,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'payment/callback',
        component: VacGpayPaymentResultComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.PAYMENT_CALLBACK,
        },
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.NOT_FOUND,
        },
      },
    ],
  },
];
