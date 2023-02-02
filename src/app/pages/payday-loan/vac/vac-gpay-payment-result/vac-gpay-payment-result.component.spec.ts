import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacGpayPaymentResultComponent } from './vac-gpay-payment-result.component';

describe('VacGpayPaymentResultComponent', () => {
  let component: VacGpayPaymentResultComponent;
  let fixture: ComponentFixture<VacGpayPaymentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacGpayPaymentResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacGpayPaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
