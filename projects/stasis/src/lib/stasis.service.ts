import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';

import { SampleData } from './model/sample.model';
import { ResultData } from './model/result.model';
import { TrackingData } from './model/tracking.model';
import { ExperimentPage } from './model/experiment.page.model';

import { MessageService } from './message.service';

const authKey = {
  headers: new HttpHeaders({
    'x-api-key': 't1I9UXgOD76x7wRPVR87r7YXQpPnM1OA6Bg4lg6J'
  })
};

@Injectable()
export class StasisService {

  private URL: string;

  private trackingPath: string = "tracking";
  private resultPath: string = "result";
  private acquisitionPath: string = "acquisition";
  private experimentPath: String = "experiment";
  private statusPath: string = "status";


  constructor(private http: HttpClient, @Inject('env') private env,
              private messageService: MessageService) {
    if (env.hasOwnProperty('production') && env.production) {
      this.URL = 'https://api.metabolomics.us/stasis';
    } else {
      this.URL = 'https://test-api.metabolomics.us/stasis';
    }
  }

  getTracking(sample: string): Observable<TrackingData>  {
    return this.http.get<TrackingData>(this.URL +'/'+ this.trackingPath +'/'+ sample, authKey);
  }

  addTracking(sample: string, status: string): Observable<TrackingData> {
    return this.http.post<TrackingData>(this.URL +'/'+ this.trackingPath, {sample: sample, status: status}, authKey);
  }

  getResults(sample: string): Observable<ResultData> {
    return this.http.get<ResultData>(this.URL +'/'+ this.resultPath +'/'+ sample, authKey);
  }

  addResult(data: ResultData): Observable<ResultData> {
    return this.http.post<ResultData>(this.URL +'/'+ this.resultPath, data, authKey);
  }

  getAcquisition(sample: string): Observable<SampleData> {
    return this.http.get<SampleData>(this.URL +'/'+ this.acquisitionPath +'/'+ sample, authKey);
  }

  createAcquisition(data: SampleData): Observable<SampleData> {
    return this.http.post<SampleData>(this.URL +'/'+ this.acquisitionPath, data, authKey);
  }

  getStatuses(): Observable<Object[]> {
    return this.http.get<Object[]>(this.URL +'/'+ this.statusPath, authKey);
  }

  getExperiment(exp: string, pageSize: number = 25, lastSample: string): Observable<ExperimentPage> {

    let fullPath = this.URL + '/' + this.experimentPath + '/' + exp + '/' + pageSize;
    if (lastSample != null && lastSample != "") {
      fullPath += '/' + lastSample;
    }

    return this.http.get<ExperimentPage>(fullPath, authKey);
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

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`StasisService: ${message}`);
  }
}
