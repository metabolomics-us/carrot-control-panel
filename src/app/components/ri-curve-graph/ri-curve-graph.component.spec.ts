import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { RiCurveGraphComponent } from './ri-curve-graph.component';

describe('RiCurveGraphComponent', () => {
  let component: RiCurveGraphComponent;
  let fixture: ComponentFixture<RiCurveGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        BrowserAnimationsModule,
        NgxChartsModule
      ],
      declarations: [ 
        RiCurveGraphComponent 
      ],
      providers: [

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiCurveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
