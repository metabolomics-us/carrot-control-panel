import { Component, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver/FileSaver';

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
    // Build a list of all samples to submit to stasis
    this.stasisSamples = [];

    Object.keys(this.data.ionizations).map(mode => {
      this.data.acquisitionData.forEach(sample => this.buildSampleData(sample, mode));

      if (this.data.hasOwnProperty('msmsData'))
        this.data.msmsData.forEach(sample => this.buildSampleData(sample, mode));
    });

    this.running = false;
    this.maxCount = this.stasisSamples.length;
    this.successCount = 0;

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
          this.errors.push(sample.sample);
        }
      );
    });

    let watchTask = () => {
      if (this.successCount + this.errors.length < this.maxCount) {
        setTimeout(() => {
          watchTask();
        }, 1000)
      }

       if (this.successCount + this.errors.length == this.maxCount && this.errors.length == 0) {
        // Used to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.data.step++;
        });
      }
    }

    watchTask();
  }

  private download() {
    let content = JSON.stringify(this.stasisSamples);
    let filename = 'MX'+ this.data.miniXID +'_'+ this.data.platform +'.json';
    let blob = new Blob([content], {type: 'application/json'});

    saveAs(blob, filename);
  }

  private nextStep() {
    this.data.step++;
  }
}