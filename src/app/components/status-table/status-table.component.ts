import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs';


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
  pageSize: number = 10;

  getDate(time) {
    return new Date(time);
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.statusDef) {
      this.statusKeys = Object.keys(this.statusDef);
      console.log(this.statusKeys);
    }

    if (this.data) {
      this.data.forEach(function(dataRow){ });
    }
  }
}
