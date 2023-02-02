import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignContractSuccessComponent } from './sign-contract-success.component';

describe('SignContractSuccessComponent', () => {
  let component: SignContractSuccessComponent;
  let fixture: ComponentFixture<SignContractSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignContractSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignContractSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
