import { Component } from '@angular/core';

@Component({
  selector: 'app-lcms',
  templateUrl: './lcms.component.html',
  styleUrls: []
})
export class LCMSComponent {
  
  lcmsPlatforms = ['CSH', 'HILIC', 'RP'];
  data = {step: 1};

  msms_suffix = {
    'pos': ['120_700', '700_800', '800_880', '880_1200'],
    'neg': ['60_700', '700_800', '800_880', '880_1200']
  };

  constructor() {}
}
