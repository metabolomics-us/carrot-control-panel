import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { SampleData, StasisService } from 'stasis';

@Component({
  selector: 'app-atf-submit',
  templateUrl: './atf-submit.component.html',
  styleUrls: []
})
export class ATFSubmitComponent extends ATFComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private StasisService: StasisService) {
    super();
  }

  ngOnInit() {
    // this.data.
  }
}