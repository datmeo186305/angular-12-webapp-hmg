import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacAdditionalInformationComponent } from './vac-additional-information.component';

describe('VacAdditionnalInformationComponent', () => {
  let component: VacAdditionalInformationComponent;
  let fixture: ComponentFixture<VacAdditionalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacAdditionalInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacAdditionalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
