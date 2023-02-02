import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlCurrentLoanUserInfoComponent } from './pl-current-loan-user-info.component';

describe('PlCurrentLoanUserInfoComponent', () => {
  let component: PlCurrentLoanUserInfoComponent;
  let fixture: ComponentFixture<PlCurrentLoanUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlCurrentLoanUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlCurrentLoanUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
