import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EkycUploadComponent } from './ekyc-upload.component';

describe('EkycUploadComponent', () => {
  let component: EkycUploadComponent;
  let fixture: ComponentFixture<EkycUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EkycUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EkycUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
