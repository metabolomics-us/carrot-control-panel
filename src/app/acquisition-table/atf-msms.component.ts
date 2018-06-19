import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { AcquisitionTableService } from './acquisition-table.service';

import * as cloneDeep from 'lodash/cloneDeep';


@Component({
  selector: 'app-atf-msms',
  templateUrl: './atf-msms.component.html',
  styleUrls: []
})
export class ATFMSMSComponent extends ATFComponent implements OnInit {

  msmsSelectedCount: number;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService) {
    super();
  }

  ngOnInit() {
    this.msmsSelectedCount = 0;

    if (this.data.hasOwnProperty('msmsSelection')) {
      // Get selection count based on pre-selected data
      this.data.msmsSelection.forEach((x, i) => {
        if (x.selected)
          this.msmsSelectedCount++;
      });
    } else {
      // Create empty selection for MS/MS samples
      this.data.msmsSelection = [];

      this.data.acquisitionData.forEach((sample, i) => {
        this.data.msmsSelection.push({selected: false, order: null})
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
        if (x.selected && x.order > this.data.msmsSelection[i].order)
          x.order--;
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

  nextStep() {
    // Add MS/MS samples
    this.data.msmsData = this.acquisitionTableService.generateSampleNumbers(this.msmsSelectedCount - 1);

    this.data.msmsSelection.forEach((x, i) => {
      if (x.selected) {
        let sample = cloneDeep(this.data.acquisitionData[i]);
        sample.filename = this.data.prefix +'_MSMS_MX'+ sample.filename.split('_MX')[1];
        this.data.msmsData[x.order - 1] = sample;
      }
    });

    window.scroll(0, 0);
    this.data.step += 1;
  }
}