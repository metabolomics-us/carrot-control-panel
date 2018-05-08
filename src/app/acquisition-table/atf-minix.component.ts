import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MiniXService } from '../minix/minix.service';

@Component({
  selector: 'app-atf-minix',
  templateUrl: './atf-minix.component.html',
  styleUrls: []
})
export class ATFMiniXComponent implements OnInit {

  @Input()
  platforms;

  @Input()
  data;

  form: FormGroup;

  miniXLoading: boolean;

  constructor(private formBuilder: FormBuilder, private miniXService: MiniXService) {}

  ngOnInit() {
    this.miniXLoading = false;

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

  pullMiniX() {
    this.miniXLoading = true;

    this.miniXService.getMiniXExport(this.form.value.minix, (error, result) => {
      this.data.prefix = this.form.value.studyLabel;
      this.data.miniXID = this.form.value.minix;
      this.data.platform = this.form.value.platform;

      this.data.miniXData = result;
      this.data.sampleData = this.miniXService.parseMiniXSamples(result);

      this.data.step += 1;

      this.miniXLoading = false;
    });
  }
}