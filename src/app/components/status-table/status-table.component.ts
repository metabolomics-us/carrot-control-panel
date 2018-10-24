import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
  pageSize: number = 50;

  getDate(time) {
    return new Date(time);
  }

  ngOnInit() {

  }

  func_1(status, current) {
    if (status.find(stat => stat.value === current))
      return true;
    else
      return false;
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

    if (this.data) {
      this.data.forEach(dataRow => {
        // var currentStats = dataRow.status.map(stat => stat.value);
        // var topStatus = dataRow.status.map(stat => stat.priority).filter(val => val === 900)[0]
        // this.statusKeys.filter(k => topStatus >= this.statusDef[key]).forEach( key => {
        //   if(currentStats.includes(key)) {
        //     console.log("has " + key);
        //     console.log(dataRow.status.filter(s => s.value === key));
        //   } else {
        //     console.log("add " + key);
        //     dataRow.status.push({"priority": this.statusDef[key], "value":key, "time": new Date()})
        //   }
        // });
      });
    }
  }
}
