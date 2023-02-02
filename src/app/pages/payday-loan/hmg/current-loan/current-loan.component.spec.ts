import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentLoanComponent } from './current-loan.component';

describe('CurrentLoanComponent', () => {
  let component: CurrentLoanComponent;
  let fixture: ComponentFixture<CurrentLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
