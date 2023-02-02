import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailLoanPaymentComponent } from './detail-loan-payment.component';

describe('DetailLoanPaymentComponent', () => {
  let component: DetailLoanPaymentComponent;
  let fixture: ComponentFixture<DetailLoanPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailLoanPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLoanPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
