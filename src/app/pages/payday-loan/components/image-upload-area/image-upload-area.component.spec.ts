import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadAreaComponent } from './image-upload-area.component';

describe('ImageUploadAreaComponent', () => {
  let component: ImageUploadAreaComponent;
  let fixture: ComponentFixture<ImageUploadAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageUploadAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
