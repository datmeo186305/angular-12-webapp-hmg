import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacSignContractTermsOfServiceComponent } from './vac-sign-contract-terms-of-service.component';

describe('VacSignContractTermsOfServiceComponent', () => {
  let component: VacSignContractTermsOfServiceComponent;
  let fixture: ComponentFixture<VacSignContractTermsOfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacSignContractTermsOfServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacSignContractTermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
