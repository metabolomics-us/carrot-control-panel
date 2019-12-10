import { Component, OnInit, Input } from '@angular/core';

// import { StasisService } from '@stasis/service';
import { StasisService, MessageService, TrackingData, ExperimentPage, ExperimentItem } from '@stasis';
import { NgxSpinnerService } from 'ngx-spinner';
// import { ExperimentPage } from 'dist/stasis/lib/model/experiment.page.model';
// import { ExperimentItem } from 'dist/stasis/lib/model/experiment.item.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() sample: string = '';
  experiment: string = '';
  @Input() pageSize: number = 25;

  resultData: any;
  statusData: Array<ExperimentItem>;
  statusObject: any;
  selectedSample: string = undefined;
  trackingData: TrackingData = undefined;

  constructor(private stasisService: StasisService, private spinner: NgxSpinnerService, private messageService: MessageService) { }

  getExperimentData(experiment: string = this.experiment, pageSize: number = this.pageSize, nextPage: string, clear = true) {

    this.spinner.show();
    this.sample;
    this.resultData;
    this.statusData;

    let response: ExperimentPage;

    if(clear)
      this.statusData = undefined;

    this.stasisService.getExperiment(experiment, pageSize, nextPage).subscribe(
      data => {
        response = data
      },
      error => console.log("Error: " + error.message),
      () => {
        this.appendItems(response.items);
        nextPage = response.last_item ? response.last_item.id : null;
        console.log(`next: ${nextPage}`)
        if(nextPage != null) {
          this.getExperimentData(experiment, pageSize, nextPage, false)
        }
    });

    this.resultData = undefined;
    this.hideSpinner();
    return response
  }

  getSampleData() {
    this.spinner.show();
    this.experiment = undefined;
    this.resultData = undefined;
    this.stasisService.getResults(this.sample).subscribe(data => { this.resultData = data; }, () => { this.hideSpinner() }, () => { this.hideSpinner() });
    this.stasisService.getTracking(this.sample).subscribe(data => { this.trackingData = data; }, () => { this.hideSpinner() });
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

  appendItems(items: ExperimentItem[]) {
    if(this.statusData != null) {
      this.statusData = this.statusData.concat(items);
    } else {
      this.statusData = items;
    }
  }
}
