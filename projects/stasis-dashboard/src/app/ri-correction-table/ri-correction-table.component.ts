import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RiCorrectionTableDataSource, RiCorrectionTableItem } from './ri-correction-table-datasource';

@Component({
  selector: 'app-ri-correction-table',
  templateUrl: './ri-correction-table.component.html',
  styleUrls: ['./ri-correction-table.component.css']
})
export class RiCorrectionTableComponent implements OnInit {
  dataSource: RiCorrectionTableDataSource;
  data$: Observable<RiCorrectionTableItem[]>;

  page = 1;
  pageSize = 10;

  ngOnInit() {
    this.dataSource = new RiCorrectionTableDataSource();
    this.data$ = this.dataSource.connect();
  }

}
