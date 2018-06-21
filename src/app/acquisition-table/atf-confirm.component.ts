import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AcquisitionDataService } from './acquisition-data.service';
import { ATFComponent } from './atf.component';

@Component({
  selector: 'app-atf-confirm',
  templateUrl: './atf-confirm.component.html',
  styleUrls: []
})
export class ATFConfirmationComponent extends ATFComponent implements OnInit {

  filenames;

  constructor(private formBuilder: FormBuilder, private acquisitionDataService: AcquisitionDataService) {
    super();
  }

  ngOnInit() {
    let msms_suffixes = this.acquisitionDataService.getMSMSRanges();

    // Generate filenames for each ionization mode
    this.data.filenames = {};

    Object.keys(this.data.ionizations).map(mode => {
      let method = mode + this.data.platform;

      this.data.filenames[mode] = [];

      this.data.acquisitionData.forEach((sample, i) => {
        this.data.filenames[mode].push(sample.filename.replace('{METHOD}', method));
      });

      if (this.data.hasOwnProperty('msmsData')) {
        this.data.msmsData.forEach((sample, i) => {
          let msms_suffix = msms_suffixes[mode][i % msms_suffixes[mode].length];
          this.data.filenames[mode].push(sample.filename.replace('{METHOD}', method) +'_'+ msms_suffix);
        });
      }

      this.filenames = this.data.filenames[mode];
    });
  }

  nextStep() {
    window.scroll(0, 0);
    this.data.step += 1;
  }
}