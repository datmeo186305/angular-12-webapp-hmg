import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../share/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {PaydayLoanRoutes} from './payday-loan-routing.module';
import {FormsModule} from '@angular/forms';
import {VerifyOtpFormComponent} from './components/verify-otp-form/verify-otp-form.component';
import {
  ElectronicSigningSuccessComponent
} from './components/electronic-signing-success/electronic-signing-success.component';
import {EkycUploadComponent} from './components/ekyc-upload/ekyc-upload.component';
import {ImageUploadAreaComponent} from './components/image-upload-area/image-upload-area.component';
import {
  PlCurrentLoanDetailInfoComponent
} from './components/pl-current-loan-detail-info/pl-current-loan-detail-info.component';
import {
  PlCurrentLoanUserInfoComponent
} from './components/pl-current-loan-user-info/pl-current-loan-user-info.component';
import {PlInlineMessageComponent} from './components/pl-inline-message/pl-inline-message.component';
import {PlStatusLabelComponent} from './components/pl-status-label/pl-status-label.component';
import {PlIntroduceComponent} from './components/pl-introduce/pl-introduce.component';
import {PlProviderComponent} from './components/pl-provider/pl-provider.component';
import {PlVoucherListComponent} from './components/pl-voucher-list/pl-voucher-list.component';
import {DetailLoanPaymentComponent} from './components/detail-loan-payment/detail-loan-payment.component';
import {IllustratingImgDialogComponent} from './components/illustrating-img-dialog/illustrating-img-dialog.component';
import {RatingComponent} from './components/rating/rating.component';
import {IntroduceComponent} from './general/introduce/introduce.component';
import {CompaniesListComponent} from './general/companies-list/companies-list.component';
import {LoanDeterminationComponent} from './hmg/loan-determination/loan-determination.component';
import {AdditionalInformationComponent} from './hmg/additional-information/additional-information.component';
import {ConfirmInformationComponent} from './hmg/confirm-information/confirm-information.component';
import {EkycComponent} from './hmg/ekyc/ekyc.component';
import {
  SignContractTermsOfServiceComponent
} from './hmg/sign-contract-terms-of-service/sign-contract-terms-of-service.component';
import {SignContractSuccessComponent} from './hmg/sign-contract-success/sign-contract-success.component';
import {
  SignContractTermsSuccessComponent
} from './hmg/sign-contract-terms-success/sign-contract-terms-success.component';
import {CurrentLoanComponent} from './hmg/current-loan/current-loan.component';
import {LoanPaymentComponent} from './hmg/loan-payment/loan-payment.component';
import {PlChoosePaymentMethodComponent} from './hmg/pl-choose-payment-method/pl-choose-payment-method.component';
import {GpayPaymentResultComponent} from './hmg/gpay-payment-result/gpay-payment-result.component';
import {SignContractComponent} from './hmg/sign-contract/sign-contract.component';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {OtpSendMethodsComponent} from './components/otp-send-methods/otp-send-methods.component';
import {MaintenanceComponent} from './general/maintenance/maintenance.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {LandingPageComponent} from './general/landing-page/landing-page.component';
import {FaqComponent} from './general/faq/faq.component';
import {QrCodeComponent} from './general/qr-code/qr-code.component';
import {EventTetComponent} from './components/event-tet/event-tet.component';
import {MaintenanceCompanyComponent} from "./general/maintenance-company/maintenance-company.component";

@NgModule({
  declarations: [
    VerifyOtpFormComponent,
    ElectronicSigningSuccessComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    PlCurrentLoanDetailInfoComponent,
    PlCurrentLoanUserInfoComponent,
    PlInlineMessageComponent,
    PlStatusLabelComponent,
    PlIntroduceComponent,
    PlProviderComponent,
    PlVoucherListComponent,
    DetailLoanPaymentComponent,
    IllustratingImgDialogComponent,
    RatingComponent,
    IntroduceComponent,
    CompaniesListComponent,
    LoanDeterminationComponent,
    AdditionalInformationComponent,
    ConfirmInformationComponent,
    EkycComponent,
    SignContractTermsOfServiceComponent,
    SignContractSuccessComponent,
    SignContractTermsSuccessComponent,
    CurrentLoanComponent,
    LoanPaymentComponent,
    PlChoosePaymentMethodComponent,
    GpayPaymentResultComponent,
    SignContractComponent,
    OtpSendMethodsComponent,
    MaintenanceComponent,
    MaintenanceCompanyComponent,
    LandingPageComponent,
    FaqComponent,
    QrCodeComponent,
    EventTetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PaydayLoanRoutes),
    SharedModule,
    TranslateModule,
    FormsModule,
    PdfViewerModule,
    NgxMatSelectSearchModule,
  ],
  exports: [
    VerifyOtpFormComponent,
    ElectronicSigningSuccessComponent,
    EkycUploadComponent,
    ImageUploadAreaComponent,
    PlCurrentLoanDetailInfoComponent,
    PlCurrentLoanUserInfoComponent,
    PlInlineMessageComponent,
    PlStatusLabelComponent,
    PlIntroduceComponent,
    PlProviderComponent,
    PlVoucherListComponent,
    DetailLoanPaymentComponent,
  ],
})
export class PaydayLoanModule {}
