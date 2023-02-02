import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngSignContractTermsOfServiceComponent } from './tng-sign-contract-terms-of-service.component';

describe('TngSignContractTermsOfServiceComponent', () => {
  let component: TngSignContractTermsOfServiceComponent;
  let fixture: ComponentFixture<TngSignContractTermsOfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngSignContractTermsOfServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngSignContractTermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
