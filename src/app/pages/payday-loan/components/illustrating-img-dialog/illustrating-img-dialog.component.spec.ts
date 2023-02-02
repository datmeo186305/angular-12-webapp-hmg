import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratingImgDialogComponent } from './illustrating-img-dialog.component';

describe('IllustratingImgDialogComponent', () => {
  let component: IllustratingImgDialogComponent;
  let fixture: ComponentFixture<IllustratingImgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IllustratingImgDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IllustratingImgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
