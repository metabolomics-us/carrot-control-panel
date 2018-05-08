import { Component } from '@angular/core';

@Component({
  selector: 'app-lcms',
  templateUrl: './lcms.component.html',
  styleUrls: []
})
export class LCMSComponent {
  
  lcmsPlatforms = ['CSH', 'HILIC'];
  data = {step: 1};

  constructor() {}

}
