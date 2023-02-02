import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonexLoadingComponent } from './monex-loading.component';

describe('MonexLoadingComponent', () => {
  let component: MonexLoadingComponent;
  let fixture: ComponentFixture<MonexLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonexLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonexLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
