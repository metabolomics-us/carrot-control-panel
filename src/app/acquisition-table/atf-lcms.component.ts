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

  miniXLoading: boolean;

  constructor(private formBuilder: FormBuilder) {
    this.miniXLoading = false;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      studyLabel: new FormControl('', [
        Validators.required,
        Validators.maxLength(16)
      ]),

      minix: new FormControl('400333', [
        Validators.required,
        Validators.pattern("\d+")
      ]),

      platform: new FormControl('')
    });
  }
}