import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AcquisitionTableService } from './acquisition-table.service';

@Component({
  selector: 'app-atf-lcms',
  templateUrl: './atf-lcms.component.html',
  styleUrls: []
})
export class ATFLCMSComponent implements OnInit {

  @Input()
  data;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      positiveMode: new FormControl(true),
      negativeMode: new FormControl(true),

      blankEnabled: new FormControl(true),
      blankLabel: new FormControl('MtdBlank'),
      blankFrequency: new FormControl(10),

      qcEnabled: new FormControl(true),
      qcLabel: new FormControl('BioRec'),
      qcFrequency: new FormControl(10),

      nistEnabled: new FormControl(false),
      nistLabel: new FormControl('NIST'),
      nistFrequency: new FormControl(100),

      randomize: new FormControl(true)
    });
  }

  nextStep() {
    this.data.ionizations = [];

    // Set ionization mode
    if (this.form.value.positiveMode)
      this.data.ionizations.push('pos');
    if (this.form.value.negativeMode)
      this.data.ionizations.push('neg');

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

    this.data.nist = {
      enabled: this.form.value.nistEnabled,
      label: this.form.value.nistLabel,
      frequency: this.form.value.nistFrequency
    };

    this.data.randomize = this.form.value.randomize;


    var sampleNames = this.acquisitionTableService.generateAcquisitionTable(this.data);
    this.data.sampleNames = sampleNames;

    this.data.step += 1;
  }
}