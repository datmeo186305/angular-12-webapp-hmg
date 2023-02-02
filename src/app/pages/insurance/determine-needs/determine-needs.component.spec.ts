import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetermineNeedsComponent } from './determine-needs.component';

describe('DetermineNeedsComponent', () => {
  let component: DetermineNeedsComponent;
  let fixture: ComponentFixture<DetermineNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetermineNeedsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetermineNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
