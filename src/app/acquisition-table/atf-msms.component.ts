import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';

import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-atf-msms',
  templateUrl: './atf-msms.component.html',
  styleUrls: []
})
export class ATFMSMSComponent extends ATFComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    var formFields = {};

    this.data.acquisitionData.forEach((sample, i) => {
      if (sample.userdata) {
        formFields[i] = false
      }
    })

    this.form = this.formBuilder.group(formFields);
  }

  countMSMS() {
    var count = 0;

    for (let sample in this.form.value) {
      if (this.form.value[sample])
        count++;
    }

    return count;
  }

  nextStep() {
    // Add MS/MS samples
    this.data.msmsData = [];

    for (let i in this.form.value) {
      if (this.form.value[i]) {
        var sample = cloneDeep(this.data.acquisitionData[i]);
        sample.filename = this.data.prefix +'_MSMS_MX'+ sample.filename.split('_MX')[1];

        this.data.msmsData.push(sample);
      }
    }

    window.scroll(0, 0);
    this.data.step += 1;
  }
}