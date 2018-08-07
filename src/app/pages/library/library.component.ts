import { Injectable } from '@angular/core';

import { HotTableRegisterer } from '@handsontable/angular';

import { CarrotHttpService } from '../../shared/services/carrot/carrot.http.service';

@Injectable()
export class LibraryComponent {

  // Form options
  acquisitionMethodOptions = [];
  platformOptions = [];

  target: any = {};
  status: any = {};

  constructor(public hotRegisterer: HotTableRegisterer, public carrotHttpService: CarrotHttpService) { }


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
    this.carrotHttpService.getAcquisitionMethods().subscribe(response => {
      this.acquisitionMethodOptions = response;
    });

    this.carrotHttpService.getPlatforms().subscribe(response => {
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
      let titles = this.acquisitionMethodOptions.map(x => x.title);

      // Check whether user actually selected an existing method that didn't get selected properly
      if (titles.includes(this.target.selectedMethod)) {
        let method = this.acquisitionMethodOptions[titles.indexOf(this.target.library)];
        this.target.library = method.chromatographicMethod.name;
        this.target.mode = method.chromatographicMethod.ionMode.mode;
        return true;
      }

      // Check that a user selected an ion mode
      else if (this.target.mode) {
        this.target.library = this.target.selectedMethod;
        return true;
      }

      // If not, check that (positive) or (negative) is found in the library name
      else if (this.target.selectedMethod.toLowerCase().indexOf('(positive)') > 0 ||
          this.target.selectedMethod.toLowerCase().indexOf('(negative)') > 0) {

        this.target.library = this.target.selectedMethod.replace(/\(positive\)/ig, '').replace(/\(negative\)/ig, '').trim();
        this.target.mode = (this.target.selectedMethod.toLowerCase().indexOf('(positive)') > 0) ? 'positive' : 'negative';
      }

      // Otherwise, error
      else {
        this.status.error = 'No ionization mode selected!';
        return false;
      }
    }

    // Handle an acquisition method object
    else {
      this.target.library = this.target.selectedMethod.chromatographicMethod.name;
      this.target.mode = this.target.selectedMethod.chromatographicMethod.ionMode.mode;
      return true;
    }

    return true;
  }
}
