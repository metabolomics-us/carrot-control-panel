import { Component, OnInit } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { StasisService } from 'stasis';
import { NgxSpinnerService } from 'ngx-spinner';

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

  constructor(private stasisService: StasisService, private spinner: NgxSpinnerService) { }

  getExperimentData() {
    this.spinner.show();
    this.stasisService.getExperiment(this.experiment).subscribe(data => { this.statusData = data; this.resultData = undefined; }, () => {}, () => { this.hideSpinner() });
  }

  getSampleData() {
    this.spinner.show();
    this.stasisService.getResults(this.sample).subscribe(data => { this.resultData = data; }, () => { this.hideSpinner() }, () => { this.hideSpinner() });
    this.stasisService.getTracking(this.sample).subscribe(data => { this.statusData = [data]; }, () => { this.hideSpinner() });
  }

  ngOnInit() { 
    this.stasisService.getStatuses().subscribe(data => { this.statusObject = data }, () => {}, () => {
      delete this.statusObject['processing'];
    });
  }

  hideSpinner() {
    this.spinner.hide();
  }
}
