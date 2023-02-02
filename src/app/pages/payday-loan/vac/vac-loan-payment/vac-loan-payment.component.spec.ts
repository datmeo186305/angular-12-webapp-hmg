import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacLoanPaymentComponent } from './vac-loan-payment.component';

describe('VacLoanPaymentComponent', () => {
  let component: VacLoanPaymentComponent;
  let fixture: ComponentFixture<VacLoanPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacLoanPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
