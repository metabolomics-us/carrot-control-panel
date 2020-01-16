import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAcquisitionTableComponent } from './upload-acquisition-table.component';

describe('UploadAcquisitionTableComponent', () => {
  let component: UploadAcquisitionTableComponent;
  let fixture: ComponentFixture<UploadAcquisitionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAcquisitionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAcquisitionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
