import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacPlChoosePaymentMethodComponent } from './vac-pl-choose-payment-method.component';

describe('VacPlChoosePaymentMethodComponent', () => {
  let component: VacPlChoosePaymentMethodComponent;
  let fixture: ComponentFixture<VacPlChoosePaymentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacPlChoosePaymentMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacPlChoosePaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
