import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { RiCurveGraphComponent } from './ri-curve-graph/ri-curve-graph.component';
import { RiCorrectionTableComponent } from './ri-correction-table/ri-correction-table.component';
import { ResultTableComponent } from './result-table/result-table.component';
import { StatusTableComponent } from './status-table/status-table.component';
import { LayoutComponent } from './layout/layout.component';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    RiCurveGraphComponent,
    RiCorrectionTableComponent,
    ResultTableComponent,
    StatusTableComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
