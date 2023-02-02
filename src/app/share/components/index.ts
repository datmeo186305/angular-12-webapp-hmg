import { FooterLandingPageComponent } from './footer-landing-page/footer-landing-page.component';
import { HeaderLandingPageComponent } from './header-landing-page/header-landing-page.component';
import { StepProgressBarComponent } from './progress-bar/step-progress-bar/step-progress-bar.component';
import { ConfirmationDialog } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { CardPaymentComponent } from './payment/card-payment/card-payment.component';
import { ChoosePaymentMethodComponent } from './payment/choose-payment-method/choose-payment-method.component';
import { SwitchTabPaymentMethodComponent } from './payment/switch-tab-payment-method/switch-tab-payment-method.component';
import { TransferPaymentComponent } from './payment/transfer-payment/transfer-payment.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { PlPromptComponent } from './dialogs/pl-prompt/pl-prompt.component';
import { OtpInputComponent } from './inputs/otp-input/otp-input.component';
import { SingleOtpInputComponent } from './inputs/single-otp-input/single-otp-input.component';
import { StepNavigationComponent } from './progress-bar/step-navigation/step-navigation.component';
import { PlLoadingComponent } from './dialogs/pl-loading/pl-loading.component';
import { GuideTransferPaymentDialogComponent } from './payment/guide-transfer-payment-dialog/guide-transfer-payment-dialog.component';
import { MonexLoadingComponent } from './loading/monex-loading/monex-loading.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';

export const components: any[] = [
  StepProgressBarComponent,
  ConfirmationDialog,
  CardPaymentComponent,
  ChoosePaymentMethodComponent,
  SwitchTabPaymentMethodComponent,
  TransferPaymentComponent,
  ShowErrorsComponent,
  OtpInputComponent,
  SingleOtpInputComponent,
  PlPromptComponent,
  StepNavigationComponent,
  PlLoadingComponent,
  GuideTransferPaymentDialogComponent,
  MonexLoadingComponent,
  HeaderLandingPageComponent,
  FooterLandingPageComponent,
  ChatBoxComponent,
];

export * from './progress-bar/step-progress-bar/step-progress-bar.component';
export * from './dialogs/confirmation-dialog/confirmation-dialog.component';
export * from './payment/card-payment/card-payment.component';
export * from './payment/choose-payment-method/choose-payment-method.component';
export * from './payment/switch-tab-payment-method/switch-tab-payment-method.component';
export * from './payment/transfer-payment/transfer-payment.component';
export * from './show-errors/show-errors.component';
export * from './dialogs/pl-prompt/pl-prompt.component';
export * from './inputs/otp-input/otp-input.component';
export * from './inputs/single-otp-input/single-otp-input.component';
export * from './progress-bar/step-navigation/step-navigation.component';
export * from './dialogs/pl-loading/pl-loading.component';
export * from './payment/guide-transfer-payment-dialog/guide-transfer-payment-dialog.component';
export * from './loading/monex-loading/monex-loading.component';
export * from './footer-landing-page/footer-landing-page.component';
export * from './header-landing-page/header-landing-page.component';
export * from './chat-box/chat-box.component';
