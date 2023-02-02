import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacLoanDeterminationComponent } from './vac-loan-determination.component';

describe('VacLoanDeterminationComponent', () => {
  let component: VacLoanDeterminationComponent;
  let fixture: ComponentFixture<VacLoanDeterminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacLoanDeterminationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacLoanDeterminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
