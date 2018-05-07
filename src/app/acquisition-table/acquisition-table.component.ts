import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-acquisition-table',
  templateUrl: './acquisition-table.component.html',
  styleUrls: ['./acquisition-table.component.css']
})
export class AcquisitionTableComponent implements OnInit {

  acquistionTableForm: FormGroup;
  minixFileLabels = ['posCSH', 'negCSH', 'posHILIC', 'negHILIC'];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.acquistionTableForm = this.formBuilder.group({
      studyLabel: new FormControl(''),

      minix1: new FormControl('', [
        Validators.required,
        Validators.pattern("\d+")
      ]),
      minix1_label: new FormControl(this.minixFileLabels),

      minix2: new FormControl('', [
        Validators.required,
        Validators.pattern("\d+")
      ]),
      minix2_label: new FormControl(this.minixFileLabels),

      blankEnabled: new FormControl(false),
      blankLabel: new FormControl('Blank'),
      blankFrequency: new FormControl(10),

      methodBlankEnabled: new FormControl(false),
      methodBlankLabel: new FormControl('MethBlank'),
      methodBlankFrequency: new FormControl(10),

      qcEnabled: new FormControl(false),
      qcLabel: new FormControl('BioRec'),
      qcFrequency: new FormControl(10),

      nistEnabled: new FormControl(false),
      nistLabel: new FormControl('NIST'),
      nistFrequency: new FormControl(100),

      msmsNumber: new FormControl(8)
    });
  }
}