import { Component, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver/FileSaver';

import { from, concat, of } from 'rxjs';
import { flatMap, mergeMap, map } from 'rxjs/operators';

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

  previousBlank;
  previousQC;

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
    this.errors = [];

    this.submitSamples();
   }

  private buildSampleData(sample, mode) {
    let ionizationMode = (mode == 'pos') ? 'positive' : 'negative';

    let metadata = !sample.hasOwnProperty('metadata') ? null :
      new Metadata(sample.metadata.class, sample.metadata.species, sample.metadata.organ);
    let userdata =  !sample.hasOwnProperty('userdata') ? null :
      new Userdata(sample.userdata.label, sample.userdata.comment);

    let references = [
      new Reference('minix', this.data.miniXID.toString())
    ];

    // Add nearest blank/qc
    if (this.data.blank.enabled && sample.ionizations[mode].startsWith(this.data.blank.label)) {
      this.previousBlank = sample.ionizations[mode];
    } else if (this.data.qc.enabled && sample.ionizations[mode].startsWith(this.data.qc.label)) {
      this.previousQC = sample.ionizations[mode];
    } else {
      if (this.previousBlank)
        references.push(new Reference('previousBlank', this.previousBlank));
      if (this.previousQC)
        references.push(new Reference('previousQC', this.previousQC));
    }

    this.stasisSamples.push(
      new SampleData(
        sample.ionizations[mode],
        this.data.miniXID.toString(),
        new Acquisition(this.data.ionizations[mode], ionizationMode, this.data.platform),
        new Processing(this.data.processingMethod),
        metadata,
        userdata,
        references
      )
    );
  }

  private submitSamples() {
    this.errors = [];
    this.running = true;

    // Submit samples to stasis
    concat(...this.stasisSamples.map(x => this.stasisService.createAcquisition(x)))
      .subscribe(
        response => {
          this.successCount++;
        },
        error => {
          console.error(error);
          this.errors.push('error');
        }
      );

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