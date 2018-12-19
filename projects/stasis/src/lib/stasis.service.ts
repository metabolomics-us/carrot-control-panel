import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { SampleData } from './model/sample.model';
import { ResultData } from './model/result.model';
import { TrackingData } from './model/tracking.model';
import { ExperimentPage } from './model/experiment.page.model';

import { MessageService } from './message.service';
import { Library } from './model/library.model';

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
    const handleError = (error) => {
      this.setAPIKey(undefined);
      return of(false);
    };

    return this.getStatuses().pipe(
      map(_ => true),
      catchError(handleError)
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

  getStatuses(): Observable<Object[]> {
    return this.http.get<Object[]>(this.URL + '/' + this.statusPath, this.buildRequestOptions());
  }

  getExperiment(exp: string, pageSize: number = 25, lastSample: string): Observable<ExperimentPage> {
    let fullPath = this.URL + '/' + this.experimentPath + '/' + exp + '/' + pageSize;

    if (lastSample != null && lastSample !== '') {
      fullPath += '/' + lastSample;
    }

    return this.http.get<ExperimentPage>(fullPath, this.buildRequestOptions());
  }

  addTarget(target: Object): Observable<Object> {
    console.log(`[StasisService] Recieved request to add target: ${JSON.stringify(target)}`)
    return this.http.post(`${this.URL}/target`, target, this.buildRequestOptions());
  }

  getLibraries(): Observable<Library[]> {
    return this.http.get<string[]>(`${this.URL}/${this.libraryPath}`, this.buildRequestOptions()).pipe(
      map(data => {
        const array = data.map(it => new Library(it))
        return array
      })
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`StasisService: ${message}`);
  }
}
