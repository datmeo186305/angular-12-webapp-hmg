import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlProviderComponent } from './pl-provider.component';

describe('PlProviderComponent', () => {
  let component: PlProviderComponent;
  let fixture: ComponentFixture<PlProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlProviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
