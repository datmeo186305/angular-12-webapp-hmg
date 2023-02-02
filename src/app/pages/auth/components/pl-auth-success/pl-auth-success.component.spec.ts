import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlAuthSuccessComponent } from './pl-auth-success.component';

describe('PlAuthSuccessComponent', () => {
  let component: PlAuthSuccessComponent;
  let fixture: ComponentFixture<PlAuthSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlAuthSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlAuthSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
