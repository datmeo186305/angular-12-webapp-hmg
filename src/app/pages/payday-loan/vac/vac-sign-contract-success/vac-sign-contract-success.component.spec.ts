import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacSignContractSuccessComponent } from './vac-sign-contract-success.component';

describe('VacSignContractSuccessComponent', () => {
  let component: VacSignContractSuccessComponent;
  let fixture: ComponentFixture<VacSignContractSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacSignContractSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacSignContractSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
