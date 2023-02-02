import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngLoanPaymentComponent } from './tng-loan-payment.component';

describe('TngLoanPaymentComponent', () => {
  let component: TngLoanPaymentComponent;
  let fixture: ComponentFixture<TngLoanPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngLoanPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
