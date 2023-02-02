import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngGpayPaymentResultComponent } from './tng-gpay-payment-result.component';

describe('TngGpayPaymentResultComponent', () => {
  let component: TngGpayPaymentResultComponent;
  let fixture: ComponentFixture<TngGpayPaymentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngGpayPaymentResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngGpayPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
