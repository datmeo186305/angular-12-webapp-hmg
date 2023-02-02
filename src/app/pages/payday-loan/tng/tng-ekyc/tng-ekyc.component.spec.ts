import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngEkycComponent } from './tng-ekyc.component';

describe('TngEkycComponent', () => {
  let component: TngEkycComponent;
  let fixture: ComponentFixture<TngEkycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngEkycComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngEkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
