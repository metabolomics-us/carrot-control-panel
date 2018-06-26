import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { Acquisition, Metadata, Processing, Reference, SampleData, StasisService, Userdata } from 'stasis';

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
      this.data.acquisitionData.forEach(sample => this.buildSampleData(sample, mode));

      if (this.data.hasOwnProperty('msmsData'))
        this.data.msmsData.forEach(sample => this.buildSampleData(sample, mode));
    });

    console.log(this.data)
  }

  private buildSampleData(sample, mode) {
    let ionizationMode = (mode == 'pos') ? 'positive' : 'negative';

    let metadata = !sample.hasOwnProperty('metadata') ? null :
      new Metadata(sample.metadata.class, sample.metadata.species, sample.metadata.organ);
    let userdata =  !sample.hasOwnProperty('userdata') ? null :
      new Userdata(sample.userdata.label, sample.userdata.comment) ;

    this.data.stasisSamples.push(
      new SampleData(
        sample.ionizations[mode],
        this.data.miniXID.toString(),
        new Acquisition(this.data.ionizations[mode], ionizationMode, this.data.platform),
        new Processing(this.data.platform),
        metadata,
        userdata,
        [
          new Reference('minix', this.data.miniXID.toString())
        ]
      )
    );
  }
}