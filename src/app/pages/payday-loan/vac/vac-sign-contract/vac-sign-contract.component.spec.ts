import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacSignContractComponent } from './vac-sign-contract.component';

describe('VacSignContractComponent', () => {
  let component: VacSignContractComponent;
  let fixture: ComponentFixture<VacSignContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacSignContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacSignContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
