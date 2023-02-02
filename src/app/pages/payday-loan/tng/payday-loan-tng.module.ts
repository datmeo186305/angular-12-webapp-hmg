import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaydayLoanTngRoutes } from '../tng/payday-loan-tng-routing.module';
import { TngEkycComponent } from './tng-ekyc/tng-ekyc.component';
import { SharedModule } from 'src/app/share/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PaydayLoanModule } from '../payday-loan.module';
import { TngConfirmInfomationComponent } from './tng-confirm-infomation/tng-confirm-infomation.component';
import { TngSignContractTermsOfServiceComponent } from './tng-sign-contract-terms-of-service/tng-sign-contract-terms-of-service.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TngSignContractTermsSuccessComponent } from './tng-sign-contract-terms-success/tng-sign-contract-terms-success.component';
import { TngLoanDeterminationComponent } from './tng-loan-determination/tng-loan-determination.component';
import { TngAdditionalInformationComponent } from './tng-additional-information/tng-additional-information.component';
import { IllustratingSalaryInfoImgDialogComponent } from './tng-additional-information/illustrating-salary-info-img-dialog/illustrating-salary-info-img-dialog.component';
import { TngCurrentLoanComponent } from './tng-current-loan/tng-current-loan.component';
import { TngSignContractComponent } from './tng-sign-contract/tng-sign-contract.component';
import { TngSignContractSuccessComponent } from './tng-sign-contract-success/tng-sign-contract-success.component';
import { TngLoanPaymentComponent } from './tng-loan-payment/tng-loan-payment.component';
import { TngPlChoosePaymentMethodComponent } from './tng-pl-choose-payment-method/tng-pl-choose-payment-method.component';
import { TngGpayPaymentResultComponent } from './tng-gpay-payment-result/tng-gpay-payment-result.component';
import { TngAdditionalDocumentsComponent } from './tng-additional-documents/tng-additional-documents.component';



@NgModule({
  declarations: [
    TngEkycComponent,
    TngConfirmInfomationComponent,
    TngSignContractTermsOfServiceComponent,
    TngSignContractTermsSuccessComponent,
    TngLoanDeterminationComponent,
    TngAdditionalInformationComponent,
    IllustratingSalaryInfoImgDialogComponent,
    TngCurrentLoanComponent,
    TngSignContractComponent,
    TngSignContractSuccessComponent,
    TngLoanPaymentComponent,
    TngPlChoosePaymentMethodComponent,
    TngGpayPaymentResultComponent,
    TngAdditionalDocumentsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaydayLoanTngRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PaydayLoanModule,
    PdfViewerModule,
    NgxMatSelectSearchModule,
  ],
})
export class PaydayLoanTngModule {}
