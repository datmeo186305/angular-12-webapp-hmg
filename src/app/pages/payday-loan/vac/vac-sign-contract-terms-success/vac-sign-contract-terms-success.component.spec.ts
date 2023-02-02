import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacSignContractTermsSuccessComponent } from './vac-sign-contract-terms-success.component';

describe('VacSignContractTermsSuccessComponent', () => {
  let component: VacSignContractTermsSuccessComponent;
  let fixture: ComponentFixture<VacSignContractTermsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacSignContractTermsSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacSignContractTermsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
