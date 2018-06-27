import { Component } from '@angular/core';

import { ATFComponent } from './atf.component';

@Component({
  selector: 'app-atf-display',
  templateUrl: './atf-display.component.html',
  styleUrls: []
})
export class ATFDisplayComponent extends ATFComponent {

  // Hack to enable access to Object.keys in view
  Object = Object;

  constructor() {
    super();
  }


  buildExport(mode: string): string {
    return mode + this.data.platform +'\n' + this.data.exportFilenames[mode].join('\n');
  }

  copy(mode: string) {
    const el = document.createElement('textarea');
    el.value = this.buildExport(mode);
    document.body.appendChild(el);

    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  downloadURL(mode: string) {
    let content = this.buildExport(mode);
    let blob = new Blob([content], {type: 'text/csv'});

    return window.URL.createObjectURL(blob);
  }

  downloadFilename(mode: string) {
    return 'MX'+ this.data.miniXID +'_'+ mode + this.data.platform +'.csv';
  }
}