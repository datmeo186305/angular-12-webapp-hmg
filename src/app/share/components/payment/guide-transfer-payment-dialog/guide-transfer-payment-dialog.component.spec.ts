import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideTransferPaymentDialogComponent } from './guide-transfer-payment-dialog.component';

describe('GuideTransferPaymentDialogComponent', () => {
  let component: GuideTransferPaymentDialogComponent;
  let fixture: ComponentFixture<GuideTransferPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuideTransferPaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideTransferPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
