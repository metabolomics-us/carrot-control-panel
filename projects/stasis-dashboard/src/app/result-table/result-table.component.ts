import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { ResultTableDataSource, ResultTableItem } from './result-table-datasource';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  dataSource: ResultTableDataSource;
  data$: Observable<ResultTableItem[]>;

  page = 1;
  pageSize = 10;

  ngOnInit() {
    this.dataSource = new ResultTableDataSource();
    this.data$ = this.dataSource.connect();
  }
}
