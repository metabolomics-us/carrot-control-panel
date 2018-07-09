import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { StatusTableDataSource, StatusTableItem } from './status-table-datasource';

@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent implements OnInit {
  dataSource: StatusTableDataSource;
  data$: Observable<StatusTableItem[]>;

  statuses = new Array(10);
  
  page = 1;
  pageSize = 10;

  ngOnInit() {
    this.dataSource = new StatusTableDataSource();
    this.data$ = this.dataSource.connect();
  }
}
