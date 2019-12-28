import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ATFComponent } from './atf.component';
import { MiniXService } from '../../shared/services/minix/minix.service';

@Component({
  selector: 'app-atf-minix',
  templateUrl: './atf-minix.component.html',
  styleUrls: []
})
export class ATFMiniXComponent extends ATFComponent implements OnInit {

  error: string;
  miniXLoading: boolean;

  constructor(private formBuilder: FormBuilder, private miniXService: MiniXService) {
    super();
  }

  ngOnInit() {
    this.miniXLoading = false;

    this.form = this.formBuilder.group({
      minix: [null, [Validators.required, Validators.pattern('\\s*\\d+\\s*')]]
    });
  }

  pullMiniX() {
    this.error = null;
    this.miniXLoading = true;

    this.miniXService.getMiniXExport(this.form.value.minix,
      (error, result) => {

        // console.log("Result: \n", result);

        this.miniXLoading = false;

        // Update form data
        this.data.miniXID = this.form.value.minix;

        // Initial prefix
        const studyLabel = result.experiment.$.title.split(',')[0].split(' ');
        this.data.prefix = studyLabel.length > 0 ? studyLabel[studyLabel.length - 1] : null;

        // console.log("Study Label: ", studyLabel);
        // console.log("Data Prefix: ", this.data.prefix);

        // Store raw MiniX data and parsed samples
        this.data.miniXData = result;
        this.data.sampleData = this.miniXService.parseMiniXSamples(result);

        // console.log("Sample Data: \n", this.data.sampleData);

        window.scroll(0, 0);
        this.data.step++;
      },
      error => {
        this.error = 'Invalid MiniX ID!';
        this.miniXLoading = false;
      }
    );
  }
}
