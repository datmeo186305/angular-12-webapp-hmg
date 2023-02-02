import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTabPaymentMethodComponent } from './switch-tab-payment-method.component';

describe('SwitchTabPaymentMethodComponent', () => {
  let component: SwitchTabPaymentMethodComponent;
  let fixture: ComponentFixture<SwitchTabPaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchTabPaymentMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTabPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
