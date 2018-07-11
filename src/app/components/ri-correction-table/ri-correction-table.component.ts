import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ri-correction-table',
  templateUrl: './ri-correction-table.component.html',
  styleUrls: ['./ri-correction-table.component.css']
})
export class RiCorrectionTableComponent implements OnInit {
  @Input() data$: Observable<any>;

  page = 1;
  pageSize = 10;

  ngOnInit() { }

}
