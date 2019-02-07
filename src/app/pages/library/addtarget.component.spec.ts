import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HotTableModule } from '@handsontable/angular';

import { GetTypePipe } from '../../shared/gettype.pipe';
import { AddTargetComponent } from './addtarget.component';

describe('AddTargetComponent', () => {
  let component: AddTargetComponent;
  let fixture: ComponentFixture<AddTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule, NgbModule.forRoot(), HotTableModule.forRoot() ],
      declarations: [ AddTargetComponent, GetTypePipe ],
      providers: [
        {
          provide: 'env',
          useValue: {production: false}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
