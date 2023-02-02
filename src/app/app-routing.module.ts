import { TitleConstants } from './core/common/title-constants';
import { LandingPageLayoutComponent } from './layout/landing-page-layout/landing-page-layout.component';
import { LandingPageComponent } from './pages/payday-loan/general/landing-page/landing-page.component';
import { MaintenanceComponent } from './pages/payday-loan/general/maintenance/maintenance.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { IntroduceComponent } from './pages/payday-loan/general/introduce/introduce.component';
import { CustomPreloadingStrategy } from './core/common/providers/custom-preloading-strategy';
import { FaqComponent } from './pages/payday-loan/general/faq/faq.component';
import {QrCodeComponent} from "./pages/payday-loan/general/qr-code/qr-code.component";
import {
  MaintenanceCompanyComponent
} from "./pages/payday-loan/general/maintenance-company/maintenance-company.component";

const routes: Routes = [
  {
    path: '',
    component: LandingPageLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.LANDING_PAGE,
        },
      },
      {
        path: 'qr-code',
        component: QrCodeComponent,
      },
      // {
      //   path: 'faq',
      //   component: FaqComponent,
      // },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // {
      //   path: 'home',
      //   component: IntroduceComponent,
      //   data: { animation: true },
      // },
      {
        path: 'maintain',
        component: MaintenanceComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.MAINTAIN,
        },
      },
      {
        path: 'maintain-company',
        component: MaintenanceCompanyComponent,
        data: {
          animation: true,
          title: TitleConstants.TITLE_VALUE.MAINTAIN_TNG,
        },
      },
      {
        path: '',
        loadChildren: () =>
          import('./pages/payday-loan/payday-loan.module').then(
            (m) => m.PaydayLoanModule
          ),
        data: { preload: true, delay: true },
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.module').then((m) => m.AuthModule),
        data: { preload: true, delay: false },
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

// Reference :https://angular.io/api/router/ExtraOptions

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'corrected',
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy],
})
export class AppRoutingModule {}
