import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

import {
    NgxChartsModule, BaseChartComponent, LineComponent, LineSeriesComponent,
    calculateViewDimensions, ViewDimensions, ColorHelper
   } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-regression-curve',
    templateUrl: './regression-curve.component.html',
    styleUrls: ['./regression-curve.component.css']
})
export class AppRegressionCurveComponent extends BaseChartComponent implements OnInit {
    @Input() data;
   
    // Properties
    @Input() xScale = 1;
    @Input() yScale = 1;
    @Input() colors = "red";

    ngOnInit() {}
   
    legendSpacing = 10;
    legend = false;
    legendOptions = [];
    activeEntries = [];
    
    onClick(event) {console.log('click');}
    onActivate(event) {console.log('activate');}
    onDeactivate(event) {console.log('deactivate');}
}