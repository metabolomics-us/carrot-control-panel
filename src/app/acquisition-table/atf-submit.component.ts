import { Component, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { Acquisition, Metadata, Processing, Reference, SampleData, StasisService, Userdata } from 'stasis';

@Component({
  selector: 'app-atf-submit',
  templateUrl: './atf-submit.component.html',
  styleUrls: []
})
export class ATFSubmitComponent extends ATFComponent implements AfterContentInit {

  running: boolean;
  maxCount: number;
  successCount: number;
  errors;

  stasisSamples;

  constructor(private formBuilder: FormBuilder, private stasisService: StasisService) {
    super();
  }

  ngAfterContentInit() {
    this.running = false;
    this.maxCount = this.data.acquisitionData.length + this.data.msmsData.length;
    this.successCount = 0;

    // Build a list of all samples to submit to stasis
    this.stasisSamples = [];

    Object.keys(this.data.ionizations).map(mode => {
      this.data.acquisitionData.forEach(sample => this.buildSampleData(sample, mode));

      if (this.data.hasOwnProperty('msmsData'))
        this.data.msmsData.forEach(sample => this.buildSampleData(sample, mode));
    });

    this.submitSamples();
   }

  private buildSampleData(sample, mode) {
    let ionizationMode = (mode == 'pos') ? 'positive' : 'negative';

    let metadata = !sample.hasOwnProperty('metadata') ? null :
      new Metadata(sample.metadata.class, sample.metadata.species, sample.metadata.organ);
    let userdata =  !sample.hasOwnProperty('userdata') ? null :
      new Userdata(sample.userdata.label, sample.userdata.comment) ;

    this.stasisSamples.push(
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

  private submitSamples() {
    this.errors = [];
    this.running = true;

    // Submit samples to stasis
    this.stasisSamples.forEach(sample => {
      console.log(`Submitting ${sample.sample}`);

      this.stasisService.createAcquisition(sample).subscribe(
        response => {
          this.successCount++;
        },
        error => {
          console.error(error);
          this.errors.push(sample.id);
        }
      );
    });

    if (this.errors.length == 0) {
      // Used to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
          this.data.step++;
      });
    }
  }
}