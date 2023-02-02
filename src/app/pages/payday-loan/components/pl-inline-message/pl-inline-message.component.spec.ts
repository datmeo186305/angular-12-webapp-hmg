import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlInlineMessageComponent } from './pl-inline-message.component';

describe('PlInlineMessageComponent', () => {
  let component: PlInlineMessageComponent;
  let fixture: ComponentFixture<PlInlineMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlInlineMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlInlineMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
