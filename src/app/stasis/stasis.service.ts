import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SampleData } from './model/sampledata.model';
import { Tracking } from './model/tracking.model';

@Injectable()
export class StasisService {

  private URL: string = 'http://localhost:1337/dev-api.metabolomics.us/stasis';

  private trackingPath: string = "tracking";
  private resultPath: string = "result";
  private acquisitionPath: string = "acquisition";

  constructor(private http: HttpClient) { }

  getTracking(sample: string): Observable<Tracking>  {
    return this.http.get<Tracking>(this.URL +'/'+ this.trackingPath +'/'+ sample);
  }

  addTracking(sample: string, status: string): Observable<Tracking> {
    return this.http.post<Tracking>(this.URL +'/'+ this.trackingPath, {sample: sample, status: status});
  }

  getResults(sample: string) {
    return this.http.get(this.URL +'/'+ this.resultPath +'/'+ sample);
  }

  addResult(data) {
    return this.http.post(this.URL +'/'+ this.resultPath, data);
  }

  getAcquisition(sample: string): Observable<SampleData> {
    return this.http.get<SampleData>(this.URL +'/'+ this.acquisitionPath +'/'+ sample);
  }

  createAcquisition(data: SampleData): Observable<SampleData> {
    return this.http.post<SampleData>(this.URL +'/'+ this.acquisitionPath, data);
  }
}
