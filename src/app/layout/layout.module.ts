import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/share/modules/material.modules';
import { SharedModule } from 'src/app/share/shared.module';
import { BlankComponent } from './blank/blank.component';
import { NotFoundComponent } from '../pages/errors/not-found/not-found.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import {AppRoutingModule} from "../app-routing.module";
import {PaydayLoanModule} from "../pages/payday-loan/payday-loan.module";
import { LandingPageLayoutComponent } from './landing-page-layout/landing-page-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MainLayoutComponent,
    NotFoundComponent,
    BlankComponent,
    LandingPageLayoutComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    SharedModule,
    TranslateModule,
    AppRoutingModule,
    PaydayLoanModule,
  ],
})
export class LayoutModule {}
