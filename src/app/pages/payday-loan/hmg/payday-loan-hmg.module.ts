import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaydayLoanHmgRoutes } from './payday-loan-hmg-routing.module';



@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(PaydayLoanHmgRoutes)],
})
export class PaydayLoanHmgModule {}
