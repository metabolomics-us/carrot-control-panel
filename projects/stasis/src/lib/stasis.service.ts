import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SampleData } from './model/sample.model';
import { ResultData } from './model/result.model';
import { TrackingData } from './model/tracking.model';
import { IExperimentParams } from './model/experiment.params.model';

@Injectable()
export class StasisService {

  private URL: string;
  private api_key: string;

  private trackingPath: string = 'tracking';
  private resultPath: string = 'result';
  private acquisitionPath: string = 'acquisition';
  private experimentPath: String = 'experiment';
  private statusPath: string = 'status';

  constructor(private http: HttpClient, @Inject('env') private env) {
    if (env.hasOwnProperty('production') && env.production) {
      this.URL = 'https://api.metabolomics.us/stasis';
    } else {
      this.URL = 'https://test-api.metabolomics.us/stasis';
    }
  }

  setAPIKey(api_key: string) {
    console.log('Setting API Key to ' + api_key);
    this.api_key = api_key;
  }

  buildRequestOptions() {
    console.log('Buulding header ' + {
      headers: new HttpHeaders().append('x-api-key', this.api_key)
    });
    return {
      headers: new HttpHeaders().append('x-api-key', this.api_key)
    };
  }

  getTracking(sample: string): Observable<TrackingData> {
    return this.http.get<TrackingData>(this.URL + '/' + this.trackingPath + '/' + sample, this.buildRequestOptions());
  }

  addTracking(sample: string, status: string): Observable<TrackingData> {
    return this.http.post<TrackingData>(this.URL + '/' + this.trackingPath, {sample: sample, status: status}, this.buildRequestOptions());
  }

  getResults(sample: string): Observable<ResultData> {
    return this.http.get<ResultData>(this.URL + '/' + this.resultPath + '/' + sample, this.buildRequestOptions());
  }

  addResult(data: ResultData): Observable<ResultData> {
    return this.http.post<ResultData>(this.URL + '/' + this.resultPath, data, this.buildRequestOptions());
  }

  getAcquisition(sample: string): Observable<SampleData> {
    return this.http.get<SampleData>(this.URL + '/' + this.acquisitionPath + '/' + sample, this.buildRequestOptions());
  }

  createAcquisition(data: SampleData): Observable<SampleData> {
    return this.http.post<SampleData>(this.URL + '/' + this.acquisitionPath, data, this.buildRequestOptions());
  }

  getExperiment(params: IExperimentParams): Observable<Object[]> {
    let fullPath = this.URL + '/' + this.experimentPath + '/' + params.experiment + '/' + params.page;

    if (params.lastSample != null && params.lastSample !== '') {
      fullPath += '/' + params.lastSample;
    }

    return this.http.get<Object[]>(fullPath, this.buildRequestOptions());
  }

  getStatuses(): Observable<Object> {
    return this.http.get<Object>(this.URL + '/' + this.statusPath, this.buildRequestOptions());
  }
}
