import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngSignContractSuccessComponent } from './tng-sign-contract-success.component';

describe('TngSignContractSuccessComponent', () => {
  let component: TngSignContractSuccessComponent;
  let fixture: ComponentFixture<TngSignContractSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngSignContractSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngSignContractSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
