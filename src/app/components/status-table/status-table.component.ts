import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackingStatus, TrackingData } from 'projects/stasis/src/public_api';


@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {
  @Input() data: any[] = []; // The data to display
  @Input() statusDef: Object = {}; // The definition of each status, string: number
  statusKeys: string[] = []; // The list of all status names, needed for *ngFor
  
  page: number = 1;
  @Input() @Output() pageSize: number;

  getDate(time) {
    return new Date(time).toLocaleString();
  }

  ngOnInit() { }

  @Input() selectedSample: string;
  @Output() selectedSampleChange: EventEmitter<string> = new EventEmitter<string>();

  onSampleSelect(sample) {
    this.selectedSample=sample;
    this.selectedSampleChange.emit(sample);
  }

  sortedStatuses(status) {
    while(status.length < this.statusKeys.length-1) {
      status.push({value:'empty'})
    }
    var sorted = status.sort((a,b) => a.priority > b.priority).map(t => t.value);
    return sorted;
  }

  get_time(status, current){
    var t = status.find(s => s.value === current).time
    if(t)
      return t;
    else
      return 0;
  }

  ngOnChanges() {
    if (this.statusDef) {
      this.statusKeys = Object.keys(this.statusDef);
    }
  }
}
