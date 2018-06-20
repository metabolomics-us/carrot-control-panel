import { Component } from '@angular/core';

@Component({
  selector: 'app-lcms',
  templateUrl: './lcms.component.html',
  styleUrls: []
})
export class LCMSComponent {
  
  data = {step: 1};

  // Hack to enable access to Object.keys in view
  Object = Object;

  msms_suffix = {
    'pos': ['120_700', '700_800', '800_880', '880_1200'],
    'neg': ['60_700', '700_800', '800_880', '880_1200']
  };

  constructor() {}

  generateAcquisitionFilenames(data, mode) {
    let filenames = [];

    data.acquisitionData.forEach((sample, i) => {
      filenames.push(sample.filename);
    });

    data.msmsData.forEach((sample, i) => {
      filenames.push(sample.filename +'_'+ this.msms_suffix[mode][i % this.msms_suffix[mode].length]);
    });

    return filenames;
  }
}
