import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-atf-msms',
  templateUrl: './atf-msms.component.html',
  styleUrls: []
})
export class ATFMSMSComponent implements OnInit {

  @Input()
  data;

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {

    this.form = this.formBuilder.group({});
  }
}