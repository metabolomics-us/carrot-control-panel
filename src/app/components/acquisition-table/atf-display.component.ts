import { Component } from '@angular/core';
import { saveAs } from 'file-saver/FileSaver';

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
    return this.data.exportFilenames[mode].join('\n');
  }

  copy(mode: string) {
    const el = document.createElement('textarea');
    el.value = this.buildExport(mode);
    document.body.appendChild(el);

    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  download(mode: string) {
    const content = this.buildExport(mode);
    const filename = 'MX' + this.data.miniXID + '_' + mode + this.data.platform + '.csv';
    const blob = new Blob([content], {type: 'text/csv'});

    saveAs(blob, filename);
  }
}
