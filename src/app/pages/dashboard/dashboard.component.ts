import { Component, OnInit, Input } from '@angular/core';

import { StasisService } from 'stasis';
import { IExperimentParams } from 'stasis';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() sample: string = '';
  experiment: string = '';

  resultData: any;
  statusData: any[];
  statusObject: Object;
  selectedSample: string = undefined;

  constructor(private stasisService: StasisService, private spinner: NgxSpinnerService) { }

  getExperimentData() {
    this.spinner.show();
    this.sample = undefined;
    this.resultData = undefined;
    this.stasisService.getExperiment({experiment: this.experiment, page: 25, lastSample: this.sample}).subscribe(data => { this.statusData = data['items']; this.resultData = undefined; }, () => {}, () => { this.hideSpinner() });
  }

  getSampleData() {
    this.spinner.show();
    this.experiment = undefined;
    this.resultData = undefined;
    this.stasisService.getResults(this.sample).subscribe(data => { this.resultData = data; }, () => { this.hideSpinner() }, () => { this.hideSpinner() });
    this.stasisService.getTracking(this.sample).subscribe(data => { this.statusData = [data]; }, () => { this.hideSpinner() });
  }

  ngOnInit() { 
    this.resultData = undefined;
    this.stasisService.getStatuses().subscribe(data => { this.statusObject = data }, () => {}, () => {
      delete this.statusObject['processing'];
    });
  }

  hideSpinner() {
    this.spinner.hide();
  }
}
