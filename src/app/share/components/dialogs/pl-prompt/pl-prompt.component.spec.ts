import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlPromptComponent } from './pl-prompt.component';

describe('PlPromptComponent', () => {
  let component: PlPromptComponent;
  let fixture: ComponentFixture<PlPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
