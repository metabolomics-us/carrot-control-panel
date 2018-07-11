import { Component, OnInit } from '@angular/core';

import { StasisService } from 'stasis';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  data = {step: 1}
  childData;

  constructor(private stasisService: StasisService) {}

  ngOnInit() {
    this.childData = this.stasisService.getResults('B5_P20Lipids_Pos_NIST01');
  }
}
