import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InsuranceRoutes} from './insurance-routing.module';
import {RouterModule} from '@angular/router';
import {DetermineNeedsComponent} from "./determine-needs/determine-needs.component";
import {InsuranceProductsChoicesComponent} from './insurance-products-choices/insurance-products-choices.component';
import {ChargeInsuranceComponent} from './charge-insurance/charge-insurance.component';
import {ChargeInsuranceFormComponent} from './components/forms/charge-insurance-form/charge-insurance-form.component';
import {ConfirmInformationComponent} from './confirm-information/confirm-information.component';
import {ConfirmInformationFormComponent} from './components/forms/confirm-information-form/confirm-information-form.component';
import {InsurancePaymentComponent} from './insurance-payment/insurance-payment.component';
import {SharedModule} from "../../share/shared.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    DetermineNeedsComponent,
    InsuranceProductsChoicesComponent,
    ChargeInsuranceComponent,
    ChargeInsuranceFormComponent,
    ConfirmInformationComponent,
    ConfirmInformationFormComponent,
    InsurancePaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(InsuranceRoutes),
    SharedModule,
    TranslateModule
  ]
})
export class InsuranceModule {
}
