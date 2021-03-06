import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';

@Component({
  selector: 'app-atf-confirm',
  templateUrl: './atf-confirm.component.html',
  styleUrls: []
})
export class ATFConfirmationComponent extends ATFComponent implements OnInit {

  filenames;
  msmsFilenames;
  poolMSMSFilenames;

  Object = Object;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.data.exportFilenames = {};

    // Pull filenames for each ionization mode
    Object.keys(this.data.ionizations).map(mode => {
      this.filenames = [];
      this.msmsFilenames = [];
      this.poolMSMSFilenames = [];

      this.data.exportFilenames[mode] = [];

      // Loop over all primary samples (blanks, QCs, and samples) and MS/MS samples
      this.data.acquisitionData.forEach(x => {
        this.filenames.push(x.ionizations[mode]);
        this.data.exportFilenames[mode].push(x.ionizations[mode]);
      });

      if (this.data.hasOwnProperty('msmsData')) {
        this.data.msmsData.forEach(x => {
          if (x.ionizations[mode].indexOf('PoolMSMS') === -1) {
            this.msmsFilenames.push(x.ionizations[mode]);
          } else {
            this.poolMSMSFilenames.push(x.ionizations[mode]);
          }

          this.data.exportFilenames[mode].push(x.ionizations[mode]);
        });
      }
    });
  }

  nextStep() {
    window.scroll(0, 0);
    this.data.step++;
  }
}
