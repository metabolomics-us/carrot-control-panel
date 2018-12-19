import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { LibraryComponent } from './library.component';

import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-addtarget',
  templateUrl: './addtarget.component.html'
})
export class AddTargetComponent extends LibraryComponent implements OnInit {

  ngOnInit() {
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
        : this.acquisitionMethodOptions.filter(v => v.toString().toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  formatter = result => result.title;


  /**
   * Validate and submit form
   */
  submit() {
    this.status.success = undefined;
    this.status.error = undefined;

    if (!this.target.targetName || this.target.targetName == '') {
      this.status.error = 'No target name provided!';
      window.scroll(0, 0);
      return;
    }
    if (!this.target.precursor || this.target.precursor == '') {
      this.status.error = 'No precursor m/z!';
      window.scroll(0, 0);
      return;
    }
    if (!this.target.retentionTime || this.target.retentionTime == '') {
      this.status.error = 'No precursor m/z!';
      window.scroll(0, 0);
      return;
    }
    if (!this.target.rtUnit) {
      this.status.error = 'No retention time units specified!';
      window.scroll(0, 0);
      return;
    }
    if (!this.validateAcquisitionMethod()) {
      window.scroll(0, 0);
      return;
    }

    let target = cloneDeep(this.target);

    // Normalize retention time
    if (target.riUnit == 'minutes') {
      target.retentionTime *= 60;
    }

    // Submit target
    this.status.submitting = true;

    this.stasisService.addTarget(target).subscribe(
      response => {
        this.status.submitting = false;
        this.status.success = true;
      },
      error => {
        this.status.submitting = false;
        this.status.error = error;
      }
    )
  }
}
