import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCompanyComponent } from './maintenance-company.component';

describe('MaintenanceCompanyComponent', () => {
  let component: MaintenanceCompanyComponent;
  let fixture: ComponentFixture<MaintenanceCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
