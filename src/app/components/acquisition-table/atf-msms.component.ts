import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { AcquisitionDataService } from './acquisition-data.service';
import { AcquisitionTableService } from './acquisition-table.service';

import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-atf-msms',
  templateUrl: './atf-msms.component.html',
  styleUrls: []
})
export class ATFMSMSComponent extends ATFComponent implements OnInit {

  msmsSelectedCount: number;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService,
      private acquisitionDataService: AcquisitionDataService) {
    super();
  }

  ngOnInit() {
    this.msmsSelectedCount = 0;

    this.form = this.formBuilder.group({
      pooledMSMS: [0, [Validators.required, Validators.pattern('\\s*\\d+\\s*')]],
      injectionLabels: ['', [Validators.pattern('([\\w\\d]+(,[\\w\\d]+)*)?')]]
    });

    if (this.data.hasOwnProperty('msmsSelection')) {
      // Get selection count based on pre-selected data
      this.data.msmsSelection.forEach((x, i) => {
        if (x.selected) {
          this.msmsSelectedCount++;
        }
      });
    } else {
      // Create empty selection for MS/MS samples
      this.data.msmsSelection = [];

      this.data.acquisitionData.forEach((sample, i) => {
        this.data.msmsSelection.push({selected: false, order: null});
      });
    }
  }

  /**
   * Add new MS/MS samples and handle ordering during removal of samples
   */
  selectMSMS(event, i) {
    if (event.target.checked) {
      this.msmsSelectedCount++;
      this.data.msmsSelection[i].order = this.msmsSelectedCount;
    } else {
      this.msmsSelectedCount--;

      this.data.msmsSelection.forEach((x, j) => {
        if (x.selected && x.order > this.data.msmsSelection[i].order) {
          x.order--;
        }
      });

      this.data.msmsSelection[i].order = null;
    }
  }

  /**
   * Deselect all MS?MS samples
   */
  resetMSMS() {
    this.msmsSelectedCount = 0;

    this.data.msmsSelection.forEach((x, i) => {
      x.selected = false;
      x.order = null;
    });
  }

  /**
   * Select last n samples for MS/MS
   */
  select(n: number) {
    this.resetMSMS();

    const indices = [];

    for (let i = this.data.msmsSelection.length - 1; i >= 0; i--) {
      if (indices.length >= n) {
        break;
      }

      if (this.data.acquisitionData[i].userdata) {
        indices.unshift(i);
      }
    }

    indices.forEach(i => {
      this.data.msmsSelection[i].selected = true;
      this.selectMSMS({target: {checked: true}}, i);
    });
  }

  nextStep() {
    const msms_suffixes = this.acquisitionDataService.getMSMSRanges();

    // Base sample for pooled MS/MS
    const baseSample = {
      acquisition: {},
      ionizations: {},
      metadata: {},
      minix: '',
      userdata: {}
    };

    // Add MS/MS samples
    this.data.msmsData = this.acquisitionTableService.generateSampleNumbers(this.msmsSelectedCount + this.form.value.pooledMSMS);

    this.data.msmsSelection.forEach((x, i) => {
      // Clumsy way to populate the base sample
      if (this.data.acquisitionData[i].hasOwnProperty('id')) {
        baseSample.acquisition = cloneDeep(this.data.acquisitionData[i].acquisition);
        baseSample.ionizations = cloneDeep(this.data.acquisitionData[i].ionizations);
        baseSample.metadata = cloneDeep(this.data.acquisitionData[i].metadata);
        baseSample.minix = this.data.acquisitionData[i].minix;
      }

      if (x.selected) {
        // Clone the selected sample and modify update filename for MS/MS
        const sample = cloneDeep(this.data.acquisitionData[i]);
        sample.filename = this.data.prefix + '_MSMS_MX' + sample.filename.split('_MX')[1];

        // Generate sample names for each ionization mode and add MS/MS suffix
        this.acquisitionTableService.generateLCMSSampleNames(this.data, sample);

        Object.keys(sample.ionizations).map(mode => {
          const msms_suffix = msms_suffixes[mode][(x.order - 1) % msms_suffixes[mode].length];
          sample.ionizations[mode] += '_' + msms_suffix;
        });

        this.data.msmsData[x.order - 1] = sample;
      }
    });

    // Add pooled MS/MS samples
    Array.from(Array(this.form.value.pooledMSMS)).forEach((x, i) => {
      const sampleNumber = this.acquisitionTableService.padNumber(i + 1, 3);

      // Create pooled MS/MS sample
      const sample = cloneDeep(baseSample);
      sample.filename = this.data.prefix + '_PoolMSMS_' + sampleNumber + '_MX' + sample.minix + '_{METHOD}';
      this.acquisitionTableService.generateLCMSSampleNames(this.data, sample);

      Object.keys(sample.ionizations).map(mode => {
        const msms_suffix = msms_suffixes[mode][i % msms_suffixes[mode].length];
        sample.ionizations[mode] += '_' + msms_suffix;
      });

      this.data.msmsData[this.msmsSelectedCount + i] = sample;
    });

    // Add multiple MS/MS injections by duplicating generated MS/MS samples
    if (this.form.value.injectionLabels !== '') {
      const labels = this.form.value.injectionLabels.split(',');

      const msmsSamples = this.data.msmsData;
      this.data.msmsData = this.acquisitionTableService.generateSampleNumbers(msmsSamples.length * labels.length);

      labels.forEach((x, i) => {
        msmsSamples.forEach((sample, j) => {
          const newSample = cloneDeep(sample);
          newSample.filename = sample.filename.replace('_MX', '_' + x + '_MX');

          Object.keys(sample.ionizations).map(mode => {
            newSample.ionizations[mode] = sample.ionizations[mode].replace('_MX', '_' + x + '_MX');
          });

          this.data.msmsData[i * msmsSamples.length + j] = newSample;
        });
      });
    }

    window.scroll(0, 0);
    this.data.step++;
  }
}
