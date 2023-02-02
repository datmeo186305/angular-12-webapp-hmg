import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacLoanStepPaymentComponent } from './vac-loan-step-payment.component';

describe('VacLoanStepPaymentComponent', () => {
  let component: VacLoanStepPaymentComponent;
  let fixture: ComponentFixture<VacLoanStepPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacLoanStepPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacLoanStepPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
