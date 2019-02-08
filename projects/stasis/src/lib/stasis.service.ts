import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError, timestamp } from 'rxjs/operators';

import { SampleData } from './model/sample.model';
import { ResultData } from './model/result.model';
import { TrackingData } from './model/tracking.model';
import { ExperimentPage } from './model/experiment.page.model';

import { MessageService } from './message.service';
import { Library } from './model/library.model';
import { LibraryTarget } from './model/library.target.model';

@Injectable()
export class StasisService {

  private URL: string;
  private api_key: string;

  private trackingPath: string = 'tracking';
  private resultPath: string = 'result';
  private acquisitionPath: string = 'acquisition';
  private experimentPath: String = 'experiment';
  private statusPath: string = 'status';
  private libraryPath: string = 'library';

  constructor(private http: HttpClient, @Inject('env') private env,
              private messageService: MessageService) {

    if (env.hasOwnProperty('production') && env.production) {
      this.URL = 'https://api.metabolomics.us/stasis';
    } else {
      this.URL = 'https://test-api.metabolomics.us/stasis';
    }
  }


  setAPIKey(api_key: string) {
    this.log('Setting API Key to ' + api_key);
    this.api_key = api_key;
  }

  validateAPIKey(api_key: string = this.api_key): Observable<boolean> {
    this.setAPIKey(api_key);

    // Unset API key is it is invalid
    const handleKeyError = (error) => {
      this.setAPIKey(undefined);
      return of(false);
    };

    return this.getStatuses().pipe(
      map(_ => true)
    );
  }

  private buildRequestOptions(api_key: string = this.api_key) {
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

  getStatuses(): Observable<Map<string,number>> {
    return this.http.get<Map<string,number>>(this.URL + '/' + this.statusPath, this.buildRequestOptions());
  }

  getExperiment(exp: string, pageSize: number = 25, lastSample?: string): Observable<ExperimentPage> {
    let fullPath = this.URL + '/' + this.experimentPath + '/' + exp + '/' + pageSize;

    if (lastSample && lastSample !== '') {
      fullPath += '/' + lastSample;
    }

    return this.http.get<ExperimentPage>(fullPath, this.buildRequestOptions());
  }

  addTarget(target: LibraryTarget): Observable<LibraryTarget> {
    return this.http.post<LibraryTarget>(`${this.URL}/target`, JSON.stringify(target), this.buildRequestOptions());
  }

  deleteTarget(target: Object): void {
    this.http.delete(`${this.URL}/target/${target}`, this.buildRequestOptions())
  }

  getLibraries(): Observable<Library[]> {
    return this.http.get<string[]>(`${this.URL}/${this.libraryPath}`, this.buildRequestOptions())
    .pipe(
      map(libstr =>
        libstr.map(it => new Library(it))
      )
    )
  }

  /**
   * Checks whether the given filename exists
   */
  checkFileStatus(filename: string): Observable<any> {
    return this.http.get(`${this.URL}/file/exists/${filename}`, this.buildRequestOptions());
  }

  submitJob(task: Object): Observable<any> {
    return of('None');
  }

  /**
   * Hardcoded platforms for now
   * Return a list of available platforms (static until an endpoint is provided)
   * @param operation 
   * @param result 
   */
  getPlatforms(): Observable<Object[]> {
    return of([{name: 'GC-MS', id: 'gcms'}, {name: 'LC-MS', id: 'lcms'}]);
  }

  private log(message: string) {
    this.messageService.add(`StasisService: ${message}`);
  }
}
