import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { AcquisitionDataService } from './acquisition-data.service';
import { AcquisitionTableService } from './acquisition-table.service';

@Component({
  selector: 'app-atf-lcms',
  templateUrl: './atf-lcms.component.html',
  styleUrls: []
})
export class ATFLCMSComponent extends ATFComponent implements OnInit {

  platforms;
  instruments;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService,
      private acquisitionDataService: AcquisitionDataService) {

    super();
  }

  ngOnInit() {
    // Get available platforms and instruments
    this.platforms = this.acquisitionDataService.getLCMSPlatforms();
    this.instruments = this.acquisitionDataService.getLCMSInstruments();

    // Combination of form groups, using existing data from model if available
    this.form = this.formBuilder.group({
      studyLabel: [this.data.prefix ? this.data.prefix : null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16)
      ]],

      platform: [this.data.platform ? this.data.platform : this.platforms[0], Validators.required],

      // Create the ionization + instrument sub-form
      ionization: this.formBuilder.group({
        positiveMode: this.data.platform ? this.data.ionizations.hasOwnProperty('pos') : true,
        positiveModeInstrument: this.data.platform && this.data.ionizations.hasOwnProperty('pos')? this.data.ionizations['pos'] : this.instruments[0],
        negativeMode: this.data.platform ? this.data.ionizations.hasOwnProperty('neg') : true,
        negativeModeInstrument: this.data.platform && this.data.ionizations.hasOwnProperty('neg') ? this.data.ionizations['neg'] : this.instruments[0]
      }, {
        validator: this.instrumentValidation
      }),

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

  instrumentValidation(control: FormGroup) {
    if (!control.value.positiveMode && !control.value.negativeMode)
      return {required: true};
    if (control.value.positiveMode && !control.value.positiveModeInstrument)
      return {required: true};
    if (control.value.negativeMode && !control.value.negativeModeInstrument)
      return {required: true};
    return null;
  }

  nextStep() {
    this.data.prefix = this.form.value.studyLabel;
    this.data.platform = this.form.value.platform;
    this.data.ionizations = {};

    // Set ionization mode
    if (this.form.value.ionization.positiveMode)
      this.data.ionizations['pos'] = this.form.value.ionization.positiveModeInstrument;
    if (this.form.value.ionization.negativeMode)
      this.data.ionizations['neg'] = this.form.value.ionization.negativeModeInstrument;

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
    this.data.step += 1;
  }
}
