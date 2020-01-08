import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HotTableModule } from '@handsontable/angular';

import { GetTypePipe } from '../../shared/gettype.pipe';
import { AddTargetComponent } from './addtarget.component';

import { CarrotHttpService } from '../../shared/services/carrot/carrot.http.service';

describe('AddTargetComponent', () => {
  let component: AddTargetComponent;
  let fixture: ComponentFixture<AddTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule, NgbModule, HotTableModule.forRoot() ],
      declarations: [ AddTargetComponent, GetTypePipe ],
      providers: [
        CarrotHttpService,
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

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
