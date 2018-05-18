import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { AcquisitionTableService } from './acquisition-table.service';

@Component({
  selector: 'app-atf-lcms',
  templateUrl: './atf-lcms.component.html',
  styleUrls: []
})
export class ATFLCMSComponent extends ATFComponent implements OnInit {

  @Input()
  platforms;

  ionizationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private acquisitionTableService: AcquisitionTableService) {
    super();
  }

  ngOnInit() {
    this.ionizationForm = this.formBuilder.group({
      positiveMode: true,
      negativeMode: true
    }, {
      validator: this.checkBoxValidation
    });

    // Combination of form groups
    this.form = this.formBuilder.group({
      studyLabel: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16)
      ]],

      platform: [this.platforms[0], Validators.required],

      ionization: this.ionizationForm,

      // preInjectionEnabled: true,
      // preInjectionLabel: ['PreInj', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      // preInjectionCount: [null, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      blankEnabled: true,
      blankLabel: ['MtdBlank', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      blankFrequency: [10, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      qcEnabled: true,
      qcLabel: ['Biorec', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      qcFrequency:  [10, [Validators.required, Validators.pattern("\\d+"), Validators.min(1)]],

      qc2Enabled: false,
      qc2Label: ['NIST', [Validators.required, Validators.minLength(1), Validators.maxLength(16)]],
      qc2Frequency: [100, [Validators.required, Validators.pattern('\\d+'), Validators.min(1)]],

      randomize: true
    });
  }

  checkBoxValidation(control: FormGroup) {
    if (!control.value.positiveMode && !control.value.negativeMode)
      return {required: true};
    return null;
  }

  nextStep() {
    this.data.prefix = this.form.value.studyLabel;
    this.data.platform = this.form.value.platform;
    this.data.ionizations = [];

    // Set ionization mode
    if (this.form.value.ionization.positiveMode)
      this.data.ionizations.push('pos');
    if (this.form.value.ionization.negativeMode)
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

    this.data.qc2 = {
      enabled: this.form.value.qc2Enabled,
      label: this.form.value.qc2Label,
      frequency: this.form.value.qc2Frequency
    };

    this.data.randomize = this.form.value.randomize;

    // Generate QC pattern generic filenames for defined samples
    var sampleNames = this.acquisitionTableService.generateAcquisitionTable(this.data);
    this.data.sampleNames = sampleNames;

    window.scroll(0, 0);
    this.data.step += 1;
  }
}
