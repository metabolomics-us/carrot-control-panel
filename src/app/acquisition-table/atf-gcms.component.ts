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
      studyLabel: [this.data.prefix ? this.data.prefix : null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16)
      ]],

      platform: [this.data.platform ? this.data.platform : this.platforms[0], Validators.required],

      instrument: [this.data.ionizations && this.data.ionizations.hasOwnProperty('pos') ? this.data.ionizations['pos'] : null, Validators.required],

      blankEnabled: this.data.blank ? this.data.blank.enabled : true,
      blankLabel: [this.data.blank ? this.data.blank.label : 'MtdBlank', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      blankFrequency: [this.data.blank ? this.data.blank.frequency : 10, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      qcEnabled: this.data.qc ? this.data.qc.enabled : true,
      qcLabel: [this.data.qc ? this.data.qc.label : 'Biorec', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      qcFrequency: [this.data.qc ? this.data.qc.frequency : 10, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      qc2Enabled: this.data.qc2 ? this.data.qc2.enabled : false,
      qc2Label: [this.data.qc2 ? this.data.qc2.label : 'NIST', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      qc2Frequency: [this.data.qc2 ? this.data.qc2.frequency : 100, [Validators.required, Validators.pattern('\\d+'), Validators.min(1)]],

      randomize: this.data.hasOwnProperty('randomize') ? this.data.randomize : true
    });
  }

  nextStep() {
    this.data.prefix = this.form.value.studyLabel;
    this.data.platform = this.form.value.platform;

    // Set ionization mode
    this.data.ionizations = {};
    this.data.ionizations['pos'] = this.form.value.instrument;

    // Set QC parameters
    this.data.blank = {
      enabled: this.form.value.blankEnabled,
      label: this.form.value.blankLabel,
      frequency: this.form.value.blankFrequency
    };

    this.data.qc = {
      enabled: this.form.value.qcEnabled,
      label: this.form.value.qcLabel,
      frequency: this.form.value.qcFrequency
    };

    this.data.qc2 = {
      enabled: this.form.value.qc2Enabled,
      label: this.form.value.qc2Label,
      frequency: this.form.value.qc2Frequency
    };

    this.data.randomize = this.form.value.randomize;

    // Generate QC pattern generic filenames for defined samples
    this.acquisitionTableService.generateAcquisitionTable(this.data);

    window.scroll(0, 0);
    this.data.step++;
  }
}
