import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { AcquisitionDataService } from './acquisition-data.service';
import { AcquisitionTableService } from './acquisition-table.service';

@Component({
  selector: 'app-atf-gcms',
  templateUrl: './atf-gcms.component.html',
  styleUrls: []
})
export class ATFGCMSComponent extends ATFComponent implements OnInit {

  platforms;
  instruments;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService,
      private acquisitionDataService: AcquisitionDataService) {

    super();
  }

  ngOnInit() {
    // Get available platforms and instruments
    this.platforms = this.acquisitionDataService.getGCMSPlatforms();
    this.instruments = this.acquisitionDataService.getGCMSInstruments();

    // Combination of form groups, using existing data from model if available
    this.form = this.formBuilder.group({
      operator: [this.data.operator ? this.data.operator : null, [
        Validators.required,
        Validators.pattern(/^[A-Za-z]{2}$/)
      ]],

      platform: [this.data.platform ? this.data.platform : this.platforms[0], Validators.required],

      instrument: [this.data.ionizations && this.data.ionizations.hasOwnProperty('pos') ? this.data.ionizations['pos'] : null, Validators.required],

      blankEnabled: this.data.blank ? this.data.blank.enabled : true,
      blankPre: this.data.blank ? this.data.blank.pre : 1,
      blankFrequency: [this.data.blank ? this.data.blank.frequency : 10, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      qcEnabled: this.data.qc ? this.data.qc.enabled : true,
      qcPre: this.data.qc ? this.data.qc.pre : 6,
      qcFrequency: [this.data.qc ? this.data.qc.frequency : 10, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      randomize: this.data.hasOwnProperty('randomize') ? this.data.randomize : true
    });
  }

  nextStep() {
    this.data.operator = this.form.value.operator;
    this.data.platform = this.form.value.platform;
    this.data.processingMethod = 'gcms';

    // Set ionization mode
    this.data.ionizations = {};
    this.data.ionizations['pos'] = this.form.value.instrument;

    // Set QC parameters
    this.data.blank = {
      enabled: this.form.value.blankEnabled,
      pre: this.form.value.blankPre,
      frequency: this.form.value.blankFrequency
    };

    this.data.qc = {
      enabled: this.form.value.qcEnabled,
      pre: this.form.value.qcPre,
      frequency: this.form.value.qcFrequency
    };

    this.data.randomize = this.form.value.randomize;

    // Generate QC pattern generic filenames for defined samples
    this.acquisitionTableService.generateGCMSAcquisitionTable(this.data);

    window.scroll(0, 0);
    this.data.step++;
  }
}
