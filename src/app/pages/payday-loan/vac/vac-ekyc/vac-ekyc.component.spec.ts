import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacEkycComponent } from './vac-ekyc.component';

describe('VacEkycComponent', () => {
  let component: VacEkycComponent;
  let fixture: ComponentFixture<VacEkycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacEkycComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacEkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
