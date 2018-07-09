import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ResultTableComponent } from '../result-table/result-table.component';
import { StatusTableComponent } from '../status-table/status-table.component';
import { RiCorrectionTableComponent } from '../ri-correction-table/ri-correction-table.component';
import { RiCurveGraphComponent } from '../ri-curve-graph/ri-curve-graph.component';

import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        NgxChartsModule
      ],
      declarations: [ 
        ResultTableComponent,
        StatusTableComponent,
        RiCorrectionTableComponent,
        RiCurveGraphComponent,
        LayoutComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
