import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { StasisService } from 'stasis';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sample: string = '';
  experiment: string = '';

  resultData: any;
  statusData: any[];
  statusObject: Object;

  getExperimentData() {
    this.stasisService.getExperiment(this.experiment).subscribe(data => { this.statusData = data; });
  }

  getSampleData() {
    this.stasisService.getResults(this.sample).subscribe(data => { this.resultData = data; });
    this.stasisService.getTracking(this.sample).subscribe(data => { this.statusData = [data]; });
  }

  constructor(private stasisService: StasisService) { }

  ngOnInit() { 
    this.stasisService.getStatuses().subscribe(data => { this.statusObject = data; });
  }
}
