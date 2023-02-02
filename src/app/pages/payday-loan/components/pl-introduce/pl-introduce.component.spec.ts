import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlIntroduceComponent } from './pl-introduce.component';

describe('PlIntroduceComponent', () => {
  let component: PlIntroduceComponent;
  let fixture: ComponentFixture<PlIntroduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlIntroduceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
