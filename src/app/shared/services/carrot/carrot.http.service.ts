import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarrotHttpService {

  constructor(private http: HttpClient) { }

  /**
   * Checks whether the given filename exists
   */
  checkFileStatus(filename: string) {
    return this.http.get(`/rest/file/exists/${filename}`);
  }

  /**
   * Returns the URL from which a file can be downloaded
   */
  getFileDownloadPath() {
    return '/rest/file/download/';
  }

  /**
   * Submits a job for processing from the scheduler
   */
  submitJob(task) {
    return this.http.post('/rest/schedule/submit', task);
  }

  /**
   * Adds a single target to the library for a given acqusition method
   */
  submitTarget(target) {
    return this.http.post('/rest/library', target);
  }

  /**
   * Return a list of available platforms (static until an endpoint is provided)
   */
  getPlatforms() {
    return of(['GC-MS', 'LC-MS']);
  }

  /**
   * Return a list of available acquisition methods
   */
  getAcquisitionMethods() {
    return this.http.get('/rest/library').pipe(
      map((response: any[]) => {
        return response
          .filter(x => x != null && x.chromatographicMethod != null)
          .map(x => {
            // Combine name and ion mode for selections
            x.title = x.chromatographicMethod.name;

            if (x.chromatographicMethod.ionMode != null) {
              x.title += ' ('+ x.chromatographicMethod.ionMode.mode +')';
            }

            return x
          });
      })
    )
  }
}
