import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacConfirmInformationComponent } from './vac-confirm-information.component';

describe('VacConfirmInformationComponent', () => {
  let component: VacConfirmInformationComponent;
  let fixture: ComponentFixture<VacConfirmInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacConfirmInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacConfirmInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
