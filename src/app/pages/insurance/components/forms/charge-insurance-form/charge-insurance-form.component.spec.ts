import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeInsuranceFormComponent } from './charge-insurance-form.component';

describe('ChargeInsuranceFormComponent', () => {
  let component: ChargeInsuranceFormComponent;
  let fixture: ComponentFixture<ChargeInsuranceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeInsuranceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeInsuranceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
