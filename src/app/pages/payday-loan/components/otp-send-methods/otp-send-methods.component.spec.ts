import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpSendMethodsComponent } from './otp-send-methods.component';

describe('OtpSendMethodsComponent', () => {
  let component: OtpSendMethodsComponent;
  let fixture: ComponentFixture<OtpSendMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpSendMethodsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpSendMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
