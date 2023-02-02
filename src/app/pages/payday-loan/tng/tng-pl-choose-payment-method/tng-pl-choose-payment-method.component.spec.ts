import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngPlChoosePaymentMethodComponent } from './tng-pl-choose-payment-method.component';

describe('TngPlChoosePaymentMethodComponent', () => {
  let component: TngPlChoosePaymentMethodComponent;
  let fixture: ComponentFixture<TngPlChoosePaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngPlChoosePaymentMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngPlChoosePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
