import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngSignContractComponent } from './tng-sign-contract.component';

describe('TngSignContractComponent', () => {
  let component: TngSignContractComponent;
  let fixture: ComponentFixture<TngSignContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngSignContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngSignContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
