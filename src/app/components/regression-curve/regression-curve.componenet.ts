import { Component, OnInit, Input } from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts';
import { ResultData } from 'stasis';

@Component({
    selector: 'app-regression-curve',
    templateUrl: './regression-curve.component.html',
    styleUrls: ['./regression-curve.component.css']
})
export class AppRegressionCurveComponent extends BaseChartComponent implements OnInit {
    @Input() sample: string;
    @Input() resultData: ResultData;

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