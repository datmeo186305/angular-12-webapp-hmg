import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeInsuranceComponent } from './charge-insurance.component';

describe('ChargeInsuranceComponent', () => {
  let component: ChargeInsuranceComponent;
  let fixture: ComponentFixture<ChargeInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeInsuranceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
