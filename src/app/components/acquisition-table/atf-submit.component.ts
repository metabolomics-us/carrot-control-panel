import { Component, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver/FileSaver';

import { from, of, forkJoin } from 'rxjs';
import { flatMap, bufferCount, concatMap, catchError } from 'rxjs/operators';

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
  submitCount: number;
  errors;
  logDownloaded: boolean;

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
    this.submitCount = 0;
    this.errors = [];
    this.logDownloaded = false;

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
    let filename = sample.ionizations[mode];

    if (this.data.blank.enabled && (filename.startsWith(this.data.blank.label) || filename.startsWith(this.data.filename_prefix +'bl'))) {
      this.previousBlank = filename;
    } else if (this.data.qc.enabled && (filename.startsWith(this.data.qc.label) || filename.startsWith(this.data.filename_prefix +'qc'))) {
      this.previousQC = filename;
    } else {
      if (this.previousBlank)
        references.push(new Reference('previousBlank', this.previousBlank));
      if (this.previousQC)
        references.push(new Reference('previousQC', this.previousQC));
    }

    this.stasisSamples.push(
      new SampleData(
        filename,
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
    // Uses flatMap to group requests into groups of 2, and each http request
    // needs a catchError in order to avoid blocking the queue
    from(this.stasisSamples).pipe(
      flatMap((x: any) => {
        return this.stasisService.createAcquisition(x).pipe(
          catchError(error => {
            this.errors.push(error);
            return of(error);
          })
        )
      }, null, 2)
    ).subscribe(response => this.submitCount++);

    let watchTask = () => {
      if (this.submitCount < this.maxCount) {
        setTimeout(() => {
          watchTask();
        }, 1000)
      }

       if (this.submitCount == this.maxCount && this.errors.length == 0) {
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
    this.logDownloaded = true;
  }

  private nextStep() {
    this.data.step++;
  }
}