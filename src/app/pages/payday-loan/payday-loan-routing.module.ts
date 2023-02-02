import { NotFoundComponent } from './../errors/not-found/not-found.component';
import { TitleConstants } from './../../core/common/title-constants';
import { Routes } from '@angular/router';
import { IntroduceComponent } from './general/introduce/introduce.component';
import { CompaniesListComponent } from './general/companies-list/companies-list.component';
import { AuthGuardService as AuthGuard } from './../../core/services/auth-guard.service';

export const PaydayLoanRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'introduce',
      //   component: IntroduceComponent,
      //   data: { animation: true },
      // },
      {
        path: 'companies',
        component: CompaniesListComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.COMPANIES,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'tng',
        pathMatch: 'full',
        component: NotFoundComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.NOT_FOUND,
        },
      },
      {
        path: 'tng',
        pathMatch: 'prefix',
        loadChildren: () =>
          import('./tng/payday-loan-tng.module').then(
            (m) => m.PaydayLoanTngModule
          ),
      },
      {
        path: 'hmg',
        pathMatch: 'full',
        component: NotFoundComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.NOT_FOUND,
        },
      },
      {
        path: 'hmg',
        pathMatch: 'prefix',
        loadChildren: () =>
          import('./hmg/payday-loan-hmg.module').then(
            (m) => m.PaydayLoanHmgModule
          ),
      },
      {
        path: 'vac',
        pathMatch: 'full',
        component: NotFoundComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.NOT_FOUND,
        },
      },
      {
        path: 'vac',
        pathMatch: 'prefix',
        loadChildren: () =>
          import('./vac/payday-loan-vac.module').then(
            (m) => m.PaydayLoanVacModule
          ),
      },
    ],
  },
];
