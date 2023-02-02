import { NotFoundComponent } from './../errors/not-found/not-found.component';
import { TitleConstants } from './../../core/common/title-constants';
import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordSuccessComponent } from './reset-password-success/reset-password-success.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpSuccessComponent } from './sign-up-success/sign-up-success.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const moduleBaseFolder = '../auth';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-up',
        component: SignUpComponent,
        data: { animation: true, title: TitleConstants.TITLE_VALUE.SIGN_UP },
      },
      {
        path: 'sign-in',
        component: SignInComponent,
        data: {
          animation: true,
          preload: true,
          title: TitleConstants.TITLE_VALUE.SIGN_IN,
        },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.FORGET_PASSWORD,
        },
      },
      {
        path: 'sign-up-success',
        component: SignUpSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.SIGN_UP_SUCCESS,
        },
      },
      {
        path: 'reset-password-success',
        component: ResetPasswordSuccessComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.RESET_PASSWORD_SUCCESS,
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
