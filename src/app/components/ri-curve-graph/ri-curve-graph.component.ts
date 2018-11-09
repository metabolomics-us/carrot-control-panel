import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-ri-curve-graph',
  templateUrl: './ri-curve-graph.component.html',
  styleUrls: ['./ri-curve-graph.component.css']
})
export class RiCurveGraphComponent implements OnInit {
  @Input() data: any = {};
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
      "name": data.sample,
      "series": (data.injections[data.sample].correction.curve).map((point) => { return { 'name': point.x, 'value': point.y } })
    }];
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() { }

  ngOnChanges() {
    if (this.data) this.results = this.processData(this.data);
  }

}
