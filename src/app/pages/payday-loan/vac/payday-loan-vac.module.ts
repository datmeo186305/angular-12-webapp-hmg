import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PaydayLoanModule } from './../payday-loan.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/share/shared.module';
import { PaydayLoanVacRoutes } from './payday-loan-vac-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VacEkycComponent } from './vac-ekyc/vac-ekyc.component';
import { VacConfirmInformationComponent } from './vac-confirm-information/vac-confirm-information.component';
import { VacAdditionalInformationComponent } from './vac-additional-information/vac-additional-information.component';
import { VacSignContractTermsOfServiceComponent } from './vac-sign-contract-terms-of-service/vac-sign-contract-terms-of-service.component';
import { VacSignContractTermsSuccessComponent } from './vac-sign-contract-terms-success/vac-sign-contract-terms-success.component';
import { VacLoanDeterminationComponent } from './vac-loan-determination/vac-loan-determination.component';
import { VacCurrentLoanComponent } from './vac-current-loan/vac-current-loan.component';
import { VacSignContractComponent } from './vac-sign-contract/vac-sign-contract.component';
import { VacSignContractSuccessComponent } from './vac-sign-contract-success/vac-sign-contract-success.component';
import { VacLoanPaymentComponent } from './vac-loan-payment/vac-loan-payment.component';
import { VacPlChoosePaymentMethodComponent } from './vac-pl-choose-payment-method/vac-pl-choose-payment-method.component';
import { VacGpayPaymentResultComponent } from './vac-gpay-payment-result/vac-gpay-payment-result.component';
import { VacLoanStepPaymentComponent } from './vac-loan-step-payment/vac-loan-step-payment.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    VacEkycComponent,
    VacConfirmInformationComponent,
    VacAdditionalInformationComponent,
    VacSignContractTermsOfServiceComponent,
    VacSignContractTermsSuccessComponent,
    VacLoanDeterminationComponent,
    VacCurrentLoanComponent,
    VacSignContractComponent,
    VacSignContractSuccessComponent,
    VacLoanPaymentComponent,
    VacPlChoosePaymentMethodComponent,
    VacGpayPaymentResultComponent,
    VacLoanStepPaymentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaydayLoanVacRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PaydayLoanModule,
    PdfViewerModule,
    NgxMatSelectSearchModule,
  ],
})
export class PaydayLoanVacModule {}
