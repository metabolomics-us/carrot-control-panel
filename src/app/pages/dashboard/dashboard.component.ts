import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { StasisService, MessageService } from 'stasis';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() experiment: string;
  @Output() experimentChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() sample: string;
  @Output() sampleChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() pageSize: number = 25;

  statusObject: any;
  @Input() messages: string[];

  @Input() selectedExperiment: string = "";
  @Output() selectedExperimentChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedSample: string = "";
  @Output() selectedSampleChange: EventEmitter<string> = new EventEmitter<string>();


  constructor(
    private stasisService: StasisService, 
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.experiment = undefined;
    this.sample = undefined;
    this.stasisService.getStatuses().subscribe(
      data => {
        this.statusObject = data
      }, 
      (error: HttpErrorResponse) => console.log('Can\'t get tracking statuses'),
      () => delete this.statusObject['processing']
    );
  }

  ngOnChange(changes: SimpleChanges) {
    console.log(`changes: ${changes}`);
    // if( typeof changes.experiment !== 'undefined'){
    //   console.log('experiment ' + JSON.stringify(changes.experiment));
    // }
    // if( typeof changes.sample !== 'undefined'){
    //   console.log('sample ' + JSON.stringify(changes.sample));
    //   this.selectedSampleChange.emit(this.sample);
    // }
    // if( typeof changes.selectedSample !== 'undefined'){
    //   console.log('selected ' + JSON.stringify(changes.sample));
    //   this.sample = changes.selectedSample.currentValue;
    // }
  }

  setExperiment() {
    this.selectedSample = undefined;
    this.selectedExperiment = this.experiment;
    this.selectedExperimentChange.emit(this.selectedExperiment);
    this.experimentChange.emit(this.experiment);
  }

  setSample() {
    this.selectedSample = this.sample;
    this.selectedSampleChange.emit(this.selectedSample);
  }

  showExperiment(): boolean {
    let show = typeof this.selectedExperiment !== 'undefined' && typeof this.selectedSample === 'undefined';
    return show;
  }

  showSample(): boolean {
    let show = typeof this.selectedSample !== 'undefined' && this.selectedSample !== "";
    return show;
  }
}
