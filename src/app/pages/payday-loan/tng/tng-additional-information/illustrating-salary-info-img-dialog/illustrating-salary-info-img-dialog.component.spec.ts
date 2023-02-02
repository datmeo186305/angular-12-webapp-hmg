import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustratingSalaryInfoImgDialogComponent } from './illustrating-salary-info-img-dialog.component';

describe('IllustratingSalaryInfoImgDialogComponent', () => {
  let component: IllustratingSalaryInfoImgDialogComponent;
  let fixture: ComponentFixture<IllustratingSalaryInfoImgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IllustratingSalaryInfoImgDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IllustratingSalaryInfoImgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
