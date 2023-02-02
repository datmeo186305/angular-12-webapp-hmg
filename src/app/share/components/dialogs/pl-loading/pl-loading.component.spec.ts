import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlLoadingComponent } from './pl-loading.component';

describe('PlLoadingComponent', () => {
  let component: PlLoadingComponent;
  let fixture: ComponentFixture<PlLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
