import { TestBed, async } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ResultTableComponent } from './result-table/result-table.component';
import { StatusTableComponent } from './status-table/status-table.component';
import { RiCorrectionTableComponent } from './ri-correction-table/ri-correction-table.component';
import { RiCurveGraphComponent } from './ri-curve-graph/ri-curve-graph.component';
import { LayoutComponent } from './layout/layout.component';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        NgbModule,
        NgxChartsModule
      ],
      declarations: [
        AppComponent,
        ResultTableComponent,
        StatusTableComponent,
        RiCorrectionTableComponent,
        RiCurveGraphComponent,
        LayoutComponent
      ],
      providers: []
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
