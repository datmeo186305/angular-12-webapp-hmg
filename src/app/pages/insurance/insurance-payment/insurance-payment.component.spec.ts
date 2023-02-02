import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePaymentComponent } from './insurance-payment.component';

describe('InsurancePaymentComponent', () => {
  let component: InsurancePaymentComponent;
  let fixture: ComponentFixture<InsurancePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
