import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePaymentMethodComponent } from './choose-payment-method.component';

describe('ChoosePaymentMethodComponent', () => {
  let component: ChoosePaymentMethodComponent;
  let fixture: ComponentFixture<ChoosePaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoosePaymentMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
