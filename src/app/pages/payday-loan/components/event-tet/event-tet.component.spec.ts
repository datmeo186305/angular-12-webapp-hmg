import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTetComponent } from './event-tet.component';

describe('EventTetComponent', () => {
  let component: EventTetComponent;
  let fixture: ComponentFixture<EventTetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
