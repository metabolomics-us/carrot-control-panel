import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
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
  let carrotHttpService: CarrotHttpService;

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
    // .then(() => {
    //   fixture = TestBed.createComponent(AddTargetComponent);
    //   component = fixture.componentInstance;
    //   // carrotHttpService = TestBed.get(CarrotHttpService);
    //   fixture.detectChanges();
    // });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTargetComponent);
    component = fixture.componentInstance;
    // carrotHttpService = TestBed.get(CarrotHttpService);
    fixture.detectChanges();
  });

  // it('should blah blah blah', () => {
  //   inject([CarrotHttpService], (injectService: CarrotHttpService) => {
  //     expect(injectService).toBe(carrotHttpService);
  //   })
  // });

  xit('should create', () => {
    console.log("AddTargetComponent");
    // console.log(component);
    // setTimeout(function(){ expect(component).toBeTruthy(); }, 3000);
    expect(component).toBeTruthy();
  });
});
