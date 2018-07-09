import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { RICurveGraphDataSource, RiCurveGraphItem } from './ri-curve-graph-datasource';

@Component({
  selector: 'app-ri-curve-graph',
  templateUrl: './ri-curve-graph.component.html',
  styleUrls: ['./ri-curve-graph.component.css']
})
export class RiCurveGraphComponent implements OnInit {
  dataSource: RICurveGraphDataSource;
  data$: Observable<RiCurveGraphItem[]>;
  data: Object[];

  view: any[] = [700, 400];

  // options
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

  onSelect(event) {
    console.log(event);
  }

  ngOnInit() {
    this.dataSource = new RICurveGraphDataSource();
    this.data$ = this.dataSource.connect();
    this.data$.subscribe(dataPoints => {
      this.data = [{
        "name": "RI Curve",
        "series": (dataPoints).map((x) => { return { 'name': x.x, 'value': x.y } })
      }]
    });
  }

}
