import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { AcquisitionDataService } from './acquisition-data.service';
import { AcquisitionTableService } from './acquisition-table.service';

import * as _ from 'lodash';


@Component({
  selector: 'app-atf-lcms',
  templateUrl: './atf-lcms.component.html',
  styleUrls: []
})
export class ATFLCMSComponent extends ATFComponent implements OnInit {

  error: string;
  platforms;
  instruments;
  matrixCount;

  // lodash import
  _: any = _;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService,
      private acquisitionDataService: AcquisitionDataService) {

    super();
  }

  ngOnInit() {
    // Get available platforms and instruments
    this.platforms = this.acquisitionDataService.getLCMSPlatforms();
    this.instruments = this.acquisitionDataService.getLCMSInstruments();

    // Check for multiple matrices in the study
    this.data.samplesByMatrix = {};
    this.matrixCount = 0;

    this.data.sampleData.forEach(x => {
      const matrix = x.metadata.species + ' ' + x.metadata.organ;

    //   console.log('Matrix: \n', matrix);

      if (!this.data.samplesByMatrix.hasOwnProperty(matrix)) {
        this.data.samplesByMatrix[matrix] = [];
        this.matrixCount++;
      }

      this.data.samplesByMatrix[matrix].push(x);
    });

    // console.log('SamplesByMatrix: \n', this.data.samplesByMatrix);

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
        positiveMode: this.data.ionizations ? this.data.ionizations.hasOwnProperty('pos') : true,
        positiveModeInstrument: this.data.ionizations && this.data.ionizations.hasOwnProperty('pos') ? this.data.ionizations['pos'] : null,
        negativeMode: this.data.ionizations ? this.data.ionizations.hasOwnProperty('neg') : true,
        negativeModeInstrument: this.data.ionizations && this.data.ionizations.hasOwnProperty('neg') ? this.data.ionizations['neg'] : null
      }, {
        validator: this.instrumentValidation
      }),

      matrix: this.data.hasOwnProperty('matrix') ? this.data.matrix : 'all',

      blankEnabled: this.data.blank ? this.data.blank.enabled : true,
      blankLabel: [this.data.blank ? this.data.blank.label : 'MtdBlank',
        [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      blankFrequency: [this.data.blank ? this.data.blank.frequency : 10,
          [Validators.required, Validators.pattern('\\d+'), Validators.min(1)]],

      qcEnabled: this.data.qc ? this.data.qc.enabled : true,
      qcLabel: [this.data.qc ? this.data.qc.label : 'Biorec',
        [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      qcFrequency: [this.data.qc ? this.data.qc.frequency : 10,
        [Validators.required, Validators.pattern('\\d+'), Validators.min(1)]],

      qc2Enabled: this.data.qc2 ? this.data.qc2.enabled : false,
      qc2Label: [this.data.qc2 ? this.data.qc2.label : 'NIST',
        [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      qc2Frequency: [this.data.qc2 ? this.data.qc2.frequency : 100,
        [Validators.required, Validators.pattern('\\d+'), Validators.min(1)]],

      pooledQC: this.data.hasOwnProperty('pooledQC') ? this.data.pooledQC.enabled : false,
      blanksFirst: this.data.hasOwnProperty('blanksFirst') ? this.data.blanksFirst : true,
      randomize: this.data.hasOwnProperty('randomize') ? this.data.randomize : 'randomize',

      customOrdering: this.data.hasOwnProperty('customOrdering') ? this.data.customOrdering : ''
    });
  }

  instrumentValidation(control: FormGroup) {
    if (!control.value.positiveMode && !control.value.negativeMode) {
      return {required: true};
    }

    if (control.value.positiveMode && !control.value.positiveModeInstrument) {
      return {required: true};
    }

    if (control.value.negativeMode && !control.value.negativeModeInstrument) {
      return {required: true};
    }

    return null;
  }

  nextStep() {
    // Validate custom ordering first if provided
    this.error = null;

    if (this.form.value.randomize === 'custom') {
      const labels = this.form.value.customOrdering
        .replace(/\r\n/g, '\n').split('\n')
        .map(x => x.trim())
        .filter(x => x !== '');

      const sampleLabels = this.data.sampleData.map(x => x.userdata.label);

      // Check that the labels match the sample labels from MiniX
      if (labels.length !== new Set([...labels, ...sampleLabels]).size) {
        this.error = 'Please ensure that the number of labels and label values match the MiniX study definition';
        return;
      }

      this.data.customOrdering = labels;
    }


    this.data.prefix = this.form.value.studyLabel;
    this.data.platform = this.form.value.platform;

    // console.log('Platform: \n', this.data.platform);

    this.data.processingMethod = 'lcms';
    this.data.ionizations = {};

    // Set ionization mode
    if (this.form.value.ionization.positiveMode) {
      this.data.ionizations['pos'] = this.form.value.ionization.positiveModeInstrument;
    }
    if (this.form.value.ionization.negativeMode) {
      this.data.ionizations['neg'] = this.form.value.ionization.negativeModeInstrument;
    }

    // console.log('Ionizations: \n', this.data.ionizations);

    // Set matrix if available
    this.data.matrix = this.form.value.matrix;

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

    // Pooled QC has the same frequncy properties as the primary QC
    this.data.pooledQC = {
      enabled: this.form.value.pooledQC,
      label: 'PoolQC',
      frequency: this.form.value.qcFrequency
    };

    this.data.blanksFirst = this.form.value.blanksFirst;
    this.data.randomize = this.form.value.randomize;

    // console.log('Blanks: \n', this.data.blanksFirst);
    // console.log('Randomize \n', this.data.randomize);

    // Generate QC pattern generic filenames for defined samples
    try {
      this.acquisitionTableService.generateLCMSAcquisitionTable(this.data);

      // Testing 
      // console.log('Generating LCMS Acquisition Table');
      // console.log('Acquisition Data: ', this.data.acquisitionData);
      console.log('Sample Data: \n', this.data.sampleData);
      console.log('Matrix: \n', this.data.matrix);    
      console.log('Data Names: \n', this.data.acquisitionData.map(x => x.filename));

    } catch (e) {
      console.log(e);
      this.error = 'Unable to generate acqusition table!  Is the MiniX study design missing any information? ' +
        'Please contact the development team if the issue persists.';
      return;
    }

    window.scroll(0, 0);
    this.data.step++;
  }
}
