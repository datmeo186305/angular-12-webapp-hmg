import { TitleConstants } from './../../../core/common/title-constants';
import { NotFoundComponent } from './../../errors/not-found/not-found.component';
import { TngAdditionalDocumentsComponent } from './tng-additional-documents/tng-additional-documents.component';
import { TngGpayPaymentResultComponent } from './tng-gpay-payment-result/tng-gpay-payment-result.component';
import { TngPlChoosePaymentMethodComponent } from './tng-pl-choose-payment-method/tng-pl-choose-payment-method.component';
import { TngLoanPaymentComponent } from './tng-loan-payment/tng-loan-payment.component';
import { TngSignContractSuccessComponent } from './tng-sign-contract-success/tng-sign-contract-success.component';
import { TngSignContractComponent } from './tng-sign-contract/tng-sign-contract.component';
import { TngLoanDeterminationComponent } from './tng-loan-determination/tng-loan-determination.component';
import { TngAdditionalInformationComponent } from './tng-additional-information/tng-additional-information.component';
import { TngSignContractTermsSuccessComponent } from './tng-sign-contract-terms-success/tng-sign-contract-terms-success.component';
import { TngSignContractTermsOfServiceComponent } from './tng-sign-contract-terms-of-service/tng-sign-contract-terms-of-service.component';
import { Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from '../../../core/services/auth-guard.service';
import { TngConfirmInfomationComponent } from './tng-confirm-infomation/tng-confirm-infomation.component';
import { TngEkycComponent } from './tng-ekyc/tng-ekyc.component';
import { TngCurrentLoanComponent } from './tng-current-loan/tng-current-loan.component';

export const PaydayLoanTngRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ekyc',
        component: TngEkycComponent,
        data: { animation: true, title: TitleConstants.TITLE_VALUE.EKYC },
        canActivate: [AuthGuard],
      },
      {
        path: 'confirm-information',
        component: TngConfirmInfomationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CONFIRM_INFORMATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter',
        component: TngSignContractTermsOfServiceComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_APPROVAL_LETTER,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-approval-letter-success',
        component: TngSignContractTermsSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_APPROVAL_LETTER_SUCCESS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-information',
        component: TngAdditionalInformationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.ADDITIONAL_INFORMATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-determination',
        component: TngLoanDeterminationComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_DETERMINATION,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'current-loan/:status',
        component: TngCurrentLoanComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CURRENT_LOAN,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'additional-documents',
        component: TngAdditionalDocumentsComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.ADDITIONAL_DOCUMENTS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract',
        component: TngSignContractComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_CONTRACT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'sign-contract-success',
        component: TngSignContractSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_CONTRACT_SUCCESS,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'loan-payment',
        component: TngLoanPaymentComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LOAN_PAYMENT,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'choose-payment-method',
        component: TngPlChoosePaymentMethodComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.CHOOSE_PAYMENT_METHOD,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'payment/callback',
        component: TngGpayPaymentResultComponent,
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
