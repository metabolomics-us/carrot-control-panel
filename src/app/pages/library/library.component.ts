import { Injectable } from '@angular/core';

import { HotTableRegisterer } from '@handsontable/angular';

import { StasisService, Target, Acquisition } from 'stasis';
import { Library } from 'dist/stasis/lib/model/library.model';
import { LibraryTarget } from 'projects/stasis/src/lib/model/library.target.model';

@Injectable()
export class LibraryComponent {

  // Form options
  acquisitionMethodOptions: Library[] = [];
  platformOptions = [];

  instrumentOptions = [];
  columnOptions=[];

  target: any = {};
  status: any = {};

  constructor(public hotRegisterer: HotTableRegisterer, public stasisService: StasisService) { }


  /**
   * Reset form
   */
  reset() {
    this.status.submitting = false;
    this.status.success = false;
    this.status.error = false;

    window.location.reload();
  }

  /**
   * Pull platform and acquisition method information from carrot scheduler
   */
  pullAcquisitionMethodsAndPlatforms() {
    this.stasisService.getLibraries().subscribe(response => {
      this.acquisitionMethodOptions = response
    });

    this.stasisService.getPlatforms().subscribe(response => {
      this.platformOptions = response;
    });
  }

  /**
   * Validate a custom acqusition method along with provided information
   */
  validateAcquisitionMethod() {
    if (!this.target.selectedMethod || this.target.selectedMethod == '') {
      this.status.error = 'No acquisition method selected!';
      return false;
    }

    // Handle a custom library name
    if (typeof this.target.selectedMethod == 'string') {
      let methods = this.acquisitionMethodOptions.map(x => x.toString());

      // Check whether user actually selected an existing method that didn't get selected properly
      if (methods.includes(this.target.selectedMethod.toString())) {
        let method = this.acquisitionMethodOptions[methods.indexOf(this.target.method)];
        this.target.method = method.method;

        this.target.instrument = method.instrument;
        this.target.column = method.column;

        this.target.mode = method.ionMode;
        return true;
      }

      // Check that a user selected an ion mode
      else if (this.target.mode) {
        this.target.method = this.target.selectedMethod;
        return true;
      }

      // If not, check that (positive) or (negative) is found in the library name
      else if (this.target.selectedMethod.toLowerCase().indexOf('(positive)') > 0 ||
          this.target.selectedMethod.toLowerCase().indexOf('(negative)') > 0) {

        this.target.method = this.target.selectedMethod.replace(/\(positive\)/ig, '').replace(/\(negative\)/ig, '').trim();
        this.target.mode = (this.target.selectedMethod.toLowerCase().indexOf('positive') > 0) ? 'positive' : 'negative';
      }

      // Check that the user selected a column
      else if (this.target.selectedInstrument.toLowerCase() != "") {
        this.target.instrument = this.target.selectedInstrument.toLowerCase();
      }

      // Check that the user selected a column
      else if (this.target.selectedColumn.toLowerCase() != "") {
        this.target.column = this.target.selectedColumn.toLowerCase();
      }

      // Otherwise, error
      else {
        this.status.error = 'No ionization mode selected!';
        return false;
      }
    }

    // Handle a Library object
    else {
      this.target.method = this.target.selectedMethod.method;
      this.target.instrument = this.target.selectedMethod.instrument;
      this.target.column = this.target.selectedMethod.column;
      this.target.mode = this.target.selectedMethod.ionMode;
      return true;
    }

    return true;
  }

  protected createTarget(target: object) {
    return new LibraryTarget(
      target['targetName'],
      new Acquisition(target['instrument'], target['mode'], target['method'], target['column']),
      target['precursor'],
      target['retentionTime'],
      target['riMarker'] ? target['riMarker'] : false,
      target['rtUnit']);
  }
}
