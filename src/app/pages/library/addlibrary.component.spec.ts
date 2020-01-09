import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HotTableModule } from '@handsontable/angular';

import { GetTypePipe } from '../../shared/gettype.pipe';
import { AddLibraryComponent } from './addlibrary.component';
import { CarrotHttpService } from '../../shared/services/carrot/carrot.http.service';

describe('AddLibraryComponent', () => {
  let component: AddLibraryComponent;
  let fixture: ComponentFixture<AddLibraryComponent>;
  // let carrotHttpService: CarrotHttpService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, HttpClientModule, NgbModule, HotTableModule.forRoot() ],
      declarations: [ AddLibraryComponent, GetTypePipe ],
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
    fixture = TestBed.createComponent(AddLibraryComponent);
    component = fixture.componentInstance;
    // carrotHttpService = TestBed.get(CarrotHttpService);
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
