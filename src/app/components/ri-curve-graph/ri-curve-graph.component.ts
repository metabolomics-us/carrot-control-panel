import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResultData } from 'projects/stasis/src/public_api';


@Component({
  selector: 'app-ri-curve-graph',
  templateUrl: './ri-curve-graph.component.html',
  styleUrls: ['./ri-curve-graph.component.css']
})
export class RiCurveGraphComponent implements OnInit {
  @Input() sample: string;
  @Input() resultData$: ResultData;
  @Input() width?: number;
  @Input() height?: number;

  results: any[] = [];

  // options
  view = [this.width || 700, this.height || 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Original';
  showYAxisLabel = true;
  yAxisLabel = 'Corrected';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  processData(data) {
    
    return [{
      "name": data,
      "series": (data.injections.correction.curve).map((point) => { return { 'name': point.x, 'value': point.y } })
    }];
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() { }

  ngOnChanges() {
    if (this.sample) this.results = this.processData(this.sample);
  }

}
