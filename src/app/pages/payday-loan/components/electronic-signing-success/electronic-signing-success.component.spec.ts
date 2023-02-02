import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicSigningSuccessComponent } from './electronic-signing-success.component';

describe('ElectronicSigningSuccessComponent', () => {
  let component: ElectronicSigningSuccessComponent;
  let fixture: ComponentFixture<ElectronicSigningSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicSigningSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronicSigningSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
