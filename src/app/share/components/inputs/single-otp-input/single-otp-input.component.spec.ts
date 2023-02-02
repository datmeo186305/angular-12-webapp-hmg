import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOtpInputComponent } from './single-otp-input.component';

describe('SingleOtpInputComponent', () => {
  let component: SingleOtpInputComponent;
  let fixture: ComponentFixture<SingleOtpInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleOtpInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleOtpInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
