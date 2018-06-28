import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { MiniXService } from '../minix/minix.service';

@Component({
  selector: 'app-atf-minix',
  templateUrl: './atf-minix.component.html',
  styleUrls: []
})
export class ATFMiniXComponent extends ATFComponent implements OnInit {

  miniXLoading: boolean;

  constructor(private formBuilder: FormBuilder, private miniXService: MiniXService) {
    super();
  }

  ngOnInit() {
    this.miniXLoading = false;

    this.form = this.formBuilder.group({
      minix: [400333, [Validators.required, Validators.pattern("\\s*\\d+\\s*")]]
    });
  }

  pullMiniX() {
    this.miniXLoading = true;

    this.miniXService.getMiniXExport(this.form.value.minix, (error, result) => {
      this.miniXLoading = false;

      // Update form data
      this.data.miniXID = this.form.value.minix;

      // Initial prefix
      let studyLabel = result.experiment.$.title.split(',')[0].split(' ');
      this.data.prefix = studyLabel.length > 0 ? studyLabel[studyLabel.length - 1] : null;

      // Store raw MiniX data and parsed samples
      this.data.miniXData = result;
      this.data.sampleData = this.miniXService.parseMiniXSamples(result);

      window.scroll(0, 0);
      this.data.step++;
    });
  }
}