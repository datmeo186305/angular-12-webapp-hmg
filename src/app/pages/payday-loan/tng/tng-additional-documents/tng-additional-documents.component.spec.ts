import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngAdditionalDocumentsComponent } from './tng-additional-documents.component';

describe('TngAdditionalDocumentsComponent', () => {
  let component: TngAdditionalDocumentsComponent;
  let fixture: ComponentFixture<TngAdditionalDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TngAdditionalDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TngAdditionalDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
