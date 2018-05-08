import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MiniXService } from '../minix/minix.service';

@Component({
  selector: 'app-acquisition-table',
  templateUrl: './acquisition-table.component.html',
  styleUrls: ['./acquisition-table.component.css']
})
export class AcquisitionTableComponent implements OnInit {

  atForm: FormGroup;
  minixFileLabels = ['CSH', 'HILIC'];

  miniXData;
  miniXLoading: boolean;

  constructor(private formBuilder: FormBuilder, private miniXService: MiniXService) {
    this.miniXLoading = false;
  }

  ngOnInit() {
    this.atForm = this.formBuilder.group({
      studyLabel: new FormControl(''),

      minix: new FormControl('400333', [
        Validators.required,
        Validators.pattern("\d+")
      ]),
      minix_label: new FormControl(this.minixFileLabels),

      positiveMode: new FormControl(false),
      negativeMode: new FormControl(false),

      blankEnabled: new FormControl(false),
      blankLabel: new FormControl('MtdBlank'),
      blankFrequency: new FormControl(10),

      qcEnabled: new FormControl(false),
      qcLabel: new FormControl('BioRec'),
      qcFrequency: new FormControl(10),

      nistEnabled: new FormControl(false),
      nistLabel: new FormControl('NIST'),
      nistFrequency: new FormControl(100),

      msmsNumber: new FormControl(8)
    });
  }

  pullMiniX() {
    this.miniXLoading = true;

    this.miniXService.getMiniXExport(this.atForm.value.minix, (error, result) => {
      this.miniXData = result;
      this.miniXLoading = false;
      console.log(this.miniXData);
    });
  }
}