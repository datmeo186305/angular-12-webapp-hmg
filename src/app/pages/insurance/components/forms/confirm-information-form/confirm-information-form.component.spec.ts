import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInformationFormComponent } from './confirm-information-form.component';

describe('ConfirmInformationFormComponent', () => {
  let component: ConfirmInformationFormComponent;
  let fixture: ComponentFixture<ConfirmInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInformationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
