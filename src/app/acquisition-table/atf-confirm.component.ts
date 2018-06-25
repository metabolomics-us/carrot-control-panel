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
    Object.keys(this.data.ionizations).map(mode => {
      let method = mode + this.data.platform;

      // Array for displaying filenames in this view
      this.filenames = [];

      // Loop over all primary samples (blanks, QCs, and samples)
      this.data.acquisitionData.forEach((sample, i) => {
        let filename = sample.filename.replace('{METHOD}', method);

        // Create an ionizations field for each sample so that we can store multiple filenames
        if (!sample.hasOwnProperty('ionizations')) {
          sample.ionizations = {};
        }

        sample.ionizations[mode] = filename;
        this.filenames.push(filename);
      });

      if (this.data.hasOwnProperty('msmsData')) {
        this.data.msmsData.forEach((sample, i) => {
          // Build filename with correct MS/MS m/z range suffix
          let msms_suffix = msms_suffixes[mode][i % msms_suffixes[mode].length];
          let filename = sample.filename.replace('{METHOD}', method) +'_'+ msms_suffix;

          // Create an ionizations field for each sample so that we can store multiple filenames
          if (!sample.hasOwnProperty('ionizations')) {
            sample.ionizations = {};
          }

          sample.ionizations[mode] = filename;
          this.filenames.push(filename);
        });
      }
    });
  }

  nextStep() {
    window.scroll(0, 0);
    this.data.step += 1;
  }
}