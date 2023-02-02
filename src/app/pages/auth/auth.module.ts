import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutes } from './auth-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MaterialModule } from 'src/app/share/modules/material.modules';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from 'src/app/share/shared.module';
import { PaydayLoanModule } from '../payday-loan/payday-loan.module';
import { SignUpSuccessComponent } from './sign-up-success/sign-up-success.component';
import { ResetPasswordSuccessComponent } from './reset-password-success/reset-password-success.component';
import { PlAuthSuccessComponent } from './components/pl-auth-success/pl-auth-success.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    SignInComponent,
    ForgotPasswordComponent,
    SignUpSuccessComponent,
    ResetPasswordSuccessComponent,
    PlAuthSuccessComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    PaydayLoanModule,
    TranslateModule,
    FormsModule
  ],
})
export class AuthModule {}
