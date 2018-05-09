import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { MiniXService } from '../minix/minix.service';

@Component({
  selector: 'app-atf-minix',
  templateUrl: './atf-minix.component.html',
  styleUrls: []
})
export class ATFMiniXComponent extends ATFComponent implements OnInit {

  @Input()
  platforms;

  miniXLoading: boolean;

  constructor(private formBuilder: FormBuilder, private miniXService: MiniXService) {
    super();
  }

  ngOnInit() {
    this.miniXLoading = false;

    this.form = this.formBuilder.group({
      studyLabel: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16)
      ]],

      minix: [null, [Validators.required, Validators.pattern("\\d+")]],

      platform: [this.platforms[0], Validators.required]
    });
  }

  pullMiniX() {
    this.miniXLoading = true;

    this.miniXService.getMiniXExport(this.form.value.minix, (error, result) => {
      this.miniXLoading = false;

      // Update form data
      this.data.prefix = this.form.value.studyLabel;
      this.data.miniXID = this.form.value.minix;
      this.data.platform = this.form.value.platform;

      // Store raw MiniX data and parsed samples
      this.data.miniXData = result;
      this.data.sampleData = this.miniXService.parseMiniXSamples(result);

      window.scroll(0, 0);
      this.data.step += 1;
    });
  }
}