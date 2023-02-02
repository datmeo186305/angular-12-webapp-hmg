import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacCurrentLoanComponent } from './vac-current-loan.component';

describe('VacCurrentLoanComponent', () => {
  let component: VacCurrentLoanComponent;
  let fixture: ComponentFixture<VacCurrentLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacCurrentLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacCurrentLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
