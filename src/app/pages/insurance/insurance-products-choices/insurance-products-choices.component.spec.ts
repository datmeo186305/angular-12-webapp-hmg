import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProductsChoicesComponent } from './insurance-products-choices.component';

describe('InsuranceProductsChoicesComponent', () => {
  let component: InsuranceProductsChoicesComponent;
  let fixture: ComponentFixture<InsuranceProductsChoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceProductsChoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceProductsChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
