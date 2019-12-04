import { Component, OnInit, Input } from '@angular/core';
import { ResultData } from 'stasis';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  @Input() resultData$: ResultData;

  page: number;
  
  constructor() {}

  ngOnInit() {}
}


/*
sample = {
  "sample":"test1529445902296",
  "injections":{
    "test1529445902296":{
      "logid":"R2D2",
      "correction":{
        "polynomial":5,
        "sampleUsed":"test",
        "curve":[
          {"x":121.12,"y":121.2},
          {"x":123.12,"y":123.2}
        ]
      },
      "results":[
        {
          "target":{
            "retentionIndex":121.12, "name":"test","id":"test_id", "mass":12.2
          },
          "annotation":{
            "retentionIndex":121.2, "intensity":10, "replaced":false, "mass":12.2
          }
        },
        {
          "target":{
            "retentionIndex":123.12,"name":"test2","id":"test_id2","mass":132.12
          },
          "annotation":{
            "retentionIndex":123.2,"intensity":103,"replaced":true,"mass":132.12
          }
        }
      ]
    }
  },
  "time":1549897315382,
  "id":"test1529445902296"
}
*/