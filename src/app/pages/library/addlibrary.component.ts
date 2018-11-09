import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { LibraryComponent } from './library.component';

import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-addlibrary',
  templateUrl: './addlibrary.component.html'
})
export class AddLibraryComponent extends LibraryComponent implements OnInit {

  // HandsOnTable properties
  hotId: string = 'scheduler';
  settings;
  data;

  ngOnInit() {
    // HandsOnTable settings and initial data
    this.settings = {
      contextMenu: true,
      rowHeaders: true,
      colHeaders: true,
      columnSorting: true,
      minSpareRows: 2,
      width: 500
    };

    this.data = [];

    this.pullAcquisitionMethodsAndPlatforms();
  }

  /**
   * Typeahead properties and methods
   */
  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.acquisitionMethodOptions
        : this.acquisitionMethodOptions.filter(v => v.title.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  formatter = result => result.title;


  /**
   * Validate and submit form
   */
  submit() {
    this.status.success = undefined;
    this.status.error = undefined;
    this.status.totalCount = 0;
    this.status.errors = [];

    if (!this.target.rtUnit) {
      this.status.error = 'No retention time units specified!';
      window.scroll(0, 0);
      return;
    }
    if (!this.validateAcquisitionMethod()) {
      window.scroll(0, 0);
      return;
    }

    // Validate data table
    let isRowEmpty = (row, i) => {
      let values = Object.values(row).filter(x => x != null && x != '');
      return Object.keys(this.data[i]).length == 0 || values.length == 0;
    }

    let instance = this.hotRegisterer.getInstance(this.hotId);
    let rowLabels: any = instance.getRowHeader();

    this.data.forEach((row, i) => {
      if (!isRowEmpty(row, i)) {
        // Error if a required field is missing
        if (!row.targetName || !row.precursor || !row.retentionTime) {
          rowLabels[i] = '<i class="fa fa-times text-danger" aria-hidden="true"></i>';
          instance.updateSettings({rowHeaders: rowLabels}, false);

          this.status.error = 'Please ensure that all targets are completed!';
        } else {
          rowLabels[i] = i + 1;
          instance.updateSettings({rowHeaders: rowLabels}, false);

          this.status.totalCount++;
        }
      } else {
        rowLabels[i] = i + 1;
        instance.updateSettings({rowHeaders: rowLabels}, false);
      }
    });

    console.log('validated')

    if (this.status.error) {
      return;
    }

    console.log('submitting')

    // Submit library
    this.status.successCount = 0;
    this.status.errorCount = 0;
    this.status.submitting = true;

    this.data.forEach((row, i) => {
      // Ignore empty rows
      if (!isRowEmpty(row, i)) {
        let target = cloneDeep(this.target);
        target.targetName = row.targetName;
        target.precursor = row.precursor;
        target.retentionTime = row.retentionTime;

        // Handle string values for checkboxes when pasted
        if (row.riMarker) {
          target.riMarker = (typeof row.riMarker == 'string' && row.riMarker == 'TRUE') || row.riMarker === true;
        } else {
          target.riMarker = false;
        }

        // Normalize retention time
        if (target.riUnit == 'minutes') {
          target.retentionTime *= 60;
        }

        this.carrotHttpService.submitTarget(target).subscribe(
          response => {
            rowLabels[i] = '<i class="fa fa-check text-success" aria-hidden="true"></i>';
            instance.updateSettings({rowHeaders: rowLabels}, false);

            this.status.successCount++;
          },
          error => {
            rowLabels[i] = '<i class="fa fa-times text-danger" aria-hidden="true"></i>';
            instance.updateSettings({rowHeaders: rowLabels}, false);

            this.status.errorCount++;

            if (error.status == 409) {
              this.status.errors.push('Target "'+ error.config.data.targetName +'" already exists in specified library!');
            } else {
              this.status.errors.push('Internal server error for target: '+ error.config.data.targetName);
            }
          }
        )
      } 
    });

    let submitLibrary = () => {
      if (this.status.successCount + this.status.errorCount < this.status.totalCount) {
        setTimeout(submitLibrary, 1000);
      } else {
        this.status.submitting = false;

        if (this.status.totalCount == this.status.successCount) {
          this.status.success = true;
        } else {
          this.status.error = 'Only '+ this.status.successCount +' / '+ this.status.totalCount
            +' targets were successfully submitted.';
        }
      }
    }

    submitLibrary();
  }
}
