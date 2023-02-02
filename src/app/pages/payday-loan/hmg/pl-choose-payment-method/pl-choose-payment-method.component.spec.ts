import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlChoosePaymentMethodComponent } from './pl-choose-payment-method.component';

describe('PlChoosePaymentMethodComponent', () => {
  let component: PlChoosePaymentMethodComponent;
  let fixture: ComponentFixture<PlChoosePaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlChoosePaymentMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlChoosePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
