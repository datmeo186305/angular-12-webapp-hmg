import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngConfirmInfomationComponent } from './tng-confirm-infomation.component';

describe('TngConfirmInfomationComponent', () => {
  let component: TngConfirmInfomationComponent;
  let fixture: ComponentFixture<TngConfirmInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngConfirmInfomationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngConfirmInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
