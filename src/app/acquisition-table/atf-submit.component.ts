import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { Acquisition, Metadata, Processing, SampleData, StasisService } from 'stasis';

@Component({
  selector: 'app-atf-submit',
  templateUrl: './atf-submit.component.html',
  styleUrls: []
})
export class ATFSubmitComponent extends ATFComponent implements OnInit {

  maxCount: number;
  successCount: number;
  errorCount: number;

  constructor(private formBuilder: FormBuilder, private StasisService: StasisService) {
    super();
  }

  ngOnInit() {
    this.maxCount = this.data.acquisitionData.length + this.data.msmsData.length;
    this.successCount = 0;
    this.errorCount = 0;

    this.data.stasisSamples = [];

    Object.keys(this.data.ionizations).map(mode => {
      this.data.forEach((sample, i) => this.buildSampleData(sample, mode));

      if (this.data.hasOwnProperty('msmsData')) {
        this.data.msmsData.forEach((sample, i) => this.buildSampleData(sample, mode));
      }
    });
  }

  private buildSampleData(sample, mode) {
    let ionizationMode = mode == 'pos' ? 'positive' : negative;

    let metadata = sample.hasOwnProperty('metadata') ?
      new Metadata(sample.metadata.class, sample.metadata.species, sample.metadata.organ) : null;
    let userdata =  sample.hasOwnProperty('userdata') ?
      new Userdata(sample.userdata.label, sample.userdata.comment) : null;

    this.data.stasisSamples.push(
      new SampleData(
        sample.ionizations[mode],
        this.data.miniXID.toString(),
        new Acquisition(this.data.ionizations[mode], ionizationMode, this.data.platform),
        new Processing(this.data.platform),
        metadata,
        userdata,
        {minix: this.data.miniXID.toString()}
      )
    );
  }
}