import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlStatusLabelComponent } from './pl-status-label.component';

describe('PlStatusLabelComponent', () => {
  let component: PlStatusLabelComponent;
  let fixture: ComponentFixture<PlStatusLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlStatusLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlStatusLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
