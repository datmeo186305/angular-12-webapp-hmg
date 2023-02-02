import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpayPaymentResultComponent } from './gpay-payment-result.component';

describe('GpayPaymentResultComponent', () => {
  let component: GpayPaymentResultComponent;
  let fixture: ComponentFixture<GpayPaymentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpayPaymentResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpayPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
