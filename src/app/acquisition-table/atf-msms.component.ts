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
  method: string;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.method = this.data.ionizations[0] + this.data.platform
    this.form = this.formBuilder.group({});
  }
}