import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngAdditionalInformationComponent } from './tng-additional-information.component';

describe('TngAdditionalInformationComponent', () => {
  let component: TngAdditionalInformationComponent;
  let fixture: ComponentFixture<TngAdditionalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngAdditionalInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngAdditionalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
