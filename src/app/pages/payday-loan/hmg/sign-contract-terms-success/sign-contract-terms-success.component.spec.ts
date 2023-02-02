import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignContractTermsSuccessComponent } from './sign-contract-terms-success.component';

describe('SignContractTermsSuccessComponent', () => {
  let component: SignContractTermsSuccessComponent;
  let fixture: ComponentFixture<SignContractTermsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignContractTermsSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignContractTermsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
