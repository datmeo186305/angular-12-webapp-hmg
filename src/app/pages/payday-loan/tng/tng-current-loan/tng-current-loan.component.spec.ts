import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngCurrentLoanComponent } from './tng-current-loan.component';

describe('TngCurrentLoanComponent', () => {
  let component: TngCurrentLoanComponent;
  let fixture: ComponentFixture<TngCurrentLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngCurrentLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngCurrentLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
