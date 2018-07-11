import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  @Input() data$: Observable<any>;

  page = 1;
  pageSize = 10;

  ngOnInit() { }
}
