import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeterminationComponent } from './loan-determination.component';

describe('LoanDeterminationComponent', () => {
  let component: LoanDeterminationComponent;
  let fixture: ComponentFixture<LoanDeterminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanDeterminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
