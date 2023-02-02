import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngSignContractTermsSuccessComponent } from './tng-sign-contract-terms-success.component';

describe('TngSignContractTermsSuccessComponent', () => {
  let component: TngSignContractTermsSuccessComponent;
  let fixture: ComponentFixture<TngSignContractTermsSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngSignContractTermsSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngSignContractTermsSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
