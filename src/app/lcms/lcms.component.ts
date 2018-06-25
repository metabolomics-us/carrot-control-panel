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

  constructor() {}
}
