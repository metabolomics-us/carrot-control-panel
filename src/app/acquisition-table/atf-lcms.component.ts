import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-atf-lcms',
  templateUrl: './atf-lcms.component.html',
  styleUrls: []
})
export class ATFLCMSComponent implements OnInit {

  @Input()
  data;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      positiveMode: new FormControl(false),
      negativeMode: new FormControl(false),

      blankEnabled: new FormControl(true),
      blankLabel: new FormControl('MtdBlank'),
      blankFrequency: new FormControl(10),

      qcEnabled: new FormControl(true),
      qcLabel: new FormControl('BioRec'),
      qcFrequency: new FormControl(10),

      nistEnabled: new FormControl(false),
      nistLabel: new FormControl('NIST'),
      nistFrequency: new FormControl(100)
    });
  }
}