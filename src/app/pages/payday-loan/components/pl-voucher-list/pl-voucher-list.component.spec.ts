import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlVoucherListComponent } from './pl-voucher-list.component';

describe('PlVoucherListComponent', () => {
  let component: PlVoucherListComponent;
  let fixture: ComponentFixture<PlVoucherListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlVoucherListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlVoucherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
