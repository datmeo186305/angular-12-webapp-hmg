import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignContractTermsOfServiceComponent} from './sign-contract-terms-of-service.component';

describe('SignContractTermsOfServiceComponent', () => {
  let component: SignContractTermsOfServiceComponent;
  let fixture: ComponentFixture<SignContractTermsOfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignContractTermsOfServiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignContractTermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
