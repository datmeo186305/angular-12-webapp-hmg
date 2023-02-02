import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngLoanDeterminationComponent } from './tng-loan-determination.component';

describe('TngLoanDeterminationComponent', () => {
  let component: TngLoanDeterminationComponent;
  let fixture: ComponentFixture<TngLoanDeterminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngLoanDeterminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngLoanDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
