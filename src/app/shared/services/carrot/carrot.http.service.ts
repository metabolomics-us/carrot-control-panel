import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * @deprecated This class is obsolete now, Carrot API was removed.
 */
@Injectable({
  providedIn: 'root'
})
export class CarrotHttpService {
  carroturl: string;

  constructor(private http: HttpClient, @Inject('env') private env) {
    this.carroturl = `http://${env.carrothost}:${env.carrotport}`;
  }

  /**
   * Checks whether the given filename exists
   */
  checkFileStatus(filename: string) {
    return this.http.get(`${this.carroturl}/rest/file/exists/${filename}`);
  }

  /**
   * Returns the URL from which a file can be downloaded
   */
  getFileDownloadPath() {
    return `${this.carroturl}/rest/file/download/`;
  }

  /**
   * Submits a job for processing from the scheduler
   */
  submitJob(task) {
    return this.http.post(`${this.carroturl}/rest/schedule/submit`, task);
  }

  /**
   * Adds a single target to the library for a given acqusition method
   */
  submitTarget(target) {
    return this.http.post(`${this.carroturl}/rest/library`, target);
  }

  /**
   * Return a list of available platforms (static until an endpoint is provided)
   */
  getPlatforms() {
    return of([{name: 'GC-MS', id: 'gcms'}, {name: 'LC-MS', id: 'lcms'}]);
  }

  /**
   * Return a list of available acquisition methods
   */
  getAcquisitionMethods() {
    return this.http.get(`${this.carroturl}/rest/library`).pipe(
      map((response: any[]) => {
        return response
          .filter(x => x != null && x.chromatographicMethod != null)
          .map(x => {
            // Combine name and ion mode for selections
            x.title = x.chromatographicMethod.name;
            x.instrument = x.chromatographicMethod.instrument;
            x.column = x.chromatographicMethod.column;

            if (x.chromatographicMethod.ionMode != null) {
              x.title += ' | ' + x.chromatographicMethod.instrument +
              ' | ' + x.chromatographicMethod.column +
              ' | ' + x.chromatographicMethod.ionMode.mode;
            }

            return x;
          });
      })
    );
  }
}
