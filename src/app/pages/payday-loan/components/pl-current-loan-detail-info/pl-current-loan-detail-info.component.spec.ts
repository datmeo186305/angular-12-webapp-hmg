import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlCurrentLoanDetailInfoComponent } from './pl-current-loan-detail-info.component';

describe('PlCurrentLoanDetailInfoComponent', () => {
  let component: PlCurrentLoanDetailInfoComponent;
  let fixture: ComponentFixture<PlCurrentLoanDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlCurrentLoanDetailInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlCurrentLoanDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
