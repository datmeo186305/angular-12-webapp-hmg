import { TitleConstants } from './../../../core/common/title-constants';
import { NotFoundComponent } from './../../errors/not-found/not-found.component';
import { AdditionalInformationComponent } from './additional-information/additional-information.component';
import { Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';
import { EkycComponent } from './ekyc/ekyc.component';
import { ConfirmInformationComponent } from './confirm-information/confirm-information.component';
import { SignContractTermsOfServiceComponent } from './sign-contract-terms-of-service/sign-contract-terms-of-service.component';
import { SignContractTermsSuccessComponent } from './sign-contract-terms-success/sign-contract-terms-success.component';
import { LoanDeterminationComponent } from './loan-determination/loan-determination.component';
import { CurrentLoanComponent } from './current-loan/current-loan.component';
import { SignContractComponent } from './sign-contract/sign-contract.component';
import { SignContractSuccessComponent } from './sign-contract-success/sign-contract-success.component';
import { LoanPaymentComponent } from './loan-payment/loan-payment.component';
import { PlChoosePaymentMethodComponent } from './pl-choose-payment-method/pl-choose-payment-method.component';
import { GpayPaymentResultComponent } from './gpay-payment-result/gpay-payment-result.component';

export const PaydayLoanHmgRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ekyc',
        component: EkycComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.EKYC,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'confirm-information',
        component: ConfirmInformationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CONFIRM_INFORMATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter',
        component: SignContractTermsOfServiceComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_APPROVAL_LETTER,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter-success',
        component: SignContractTermsSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_APPROVAL_LETTER_SUCCESS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-information',
        component: AdditionalInformationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.ADDITIONAL_INFORMATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-determination',
        component: LoanDeterminationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_DETERMINATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'current-loan/:status',
        component: CurrentLoanComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CURRENT_LOAN,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract',
        component: SignContractComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_CONTRACT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract-success',
        component: SignContractSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_CONTRACT_SUCCESS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-payment',
        component: LoanPaymentComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_PAYMENT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'choose-payment-method',
        component: PlChoosePaymentMethodComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CHOOSE_PAYMENT_METHOD,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'payment/callback',
        component: GpayPaymentResultComponent,
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
