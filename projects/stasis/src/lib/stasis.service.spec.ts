import { async, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

import { SampleData } from './model/sample.model';
import { Acquisition } from './model/sample.acquisition.model';
import { Processing } from './model/sample.processing.model';
import { Metadata } from './model/sample.metadata.model';
import { Userdata } from './model/sample.userdata.model';

import { ResultData } from './model/result.model';
import { Injection } from './model/result.injection.model';
import { Correction } from './model/result.correction.model';
import { CorrectionPoint } from './model/result.correction.point.model';
import { Result } from './model/result.result.model';
import { Target } from './model/result.target.model';
import { Annotation } from './model/result.annotation.model';



import { StasisService } from './stasis.service';

// Define sample filename as global variable
let filename = "test"+ Date.now();

describe('StatisService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ StasisService ]
    });

    service = TestBed.get(StasisService);
  });

  it('should be created', inject([StasisService], (service: StasisService) => {
    expect(service).toBeTruthy();
  }));

  it('should create/get acquisition', async(() => {
    expect(service).toBeTruthy();

    let sampleData: SampleData = new SampleData(
      filename,
      '12345',
      new Acquisition('instrument A', 'positive', 'gcms'),
      new Processing('gcms'),
      new Metadata('123456', 'rat', 'tissue'),
      new Userdata('file123', ''),
      {minix: 12345}
    );

    service.createAcquisition(sampleData).subscribe(
      response => {
        expect(response).not.toBeNull();
        expect(response.id).toEqual(filename);
        expect(response.userdata.label).toEqual(sampleData.userdata.label);
        expect(response.references.minix).toEqual(12345);

        // Pull created sample acquisition
        setTimeout(() => {
          service.getAcquisition(filename).subscribe(
            response => {
              expect(response).not.toBeNull();
              expect(response.id).toEqual(filename);
              expect(response.userdata.label).toEqual(sampleData.userdata.label);
              expect(response.references.minix).toEqual(12345);
            },
            (error: HttpErrorResponse) =>
              fail(error.status == 0 ? 'CORS Error' : 'HTTP GET error: '+ JSON.stringify(error))
          );
        }, 1000);
      },
      (error: HttpErrorResponse) =>
        fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
    );
  }));

  it('should create/get tracking', async(() => {
    expect(service).toBeTruthy();

    service.addTracking(filename, 'entered').subscribe(
      response => {
        expect(response.id).toEqual(filename);
        expect(response.status[0].value).toEqual('entered');

        // Pull created sample tracking data
        setTimeout(() => {
          service.getTracking(filename).subscribe(
            response => {
              expect(response.id).toEqual(filename);
              expect(response.status[0].value).toEqual('entered');
            },
            (error: HttpErrorResponse) =>
              fail(error.status == 0 ? 'CORS Error' : 'HTTP GET error: '+ JSON.stringify(error))
          );
        }, 1000);
      },
      (error: HttpErrorResponse) =>
        fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
    );
  }));

  it('should create/get result', async(() => {
    expect(service).toBeTruthy();

    let resultData = new ResultData(
      filename,
      {'test_1': new Injection(
        'R2D2',
        new Correction(5, 'test', [new CorrectionPoint(121.12, 121.2), new CorrectionPoint(123.12, 123.2)]),
        [
          new Result(
            new Target(121.12, "test", "test_id", 12.2),
            new Annotation(121.2, 10.0, false, 12.2)
          ),
          new Result(
            new Target(123.12, "test2", "test_id2", 132.12),
            new Annotation(123.2, 103.0, true, 132.12)
          )
        ]
      )}
    );

    service.addResult(resultData).subscribe(
      response => {
        // Soft accessing of keys is necessary without a domain object
        expect(response.sample).toEqual(filename);
        expect(Object.keys(response.injections).length).toBeGreaterThan(0);

        // Pull created sample result data
        setTimeout(() => {
          service.getResults(filename).subscribe(
            response => {
              expect(response.sample).toEqual(filename);
              expect(Object.keys(response.injections).length).toBeGreaterThan(0);
            },
            (error: HttpErrorResponse) =>
              fail(error.status == 0 ? 'CORS Error' : 'HTTP GET error: '+ JSON.stringify(error))
          );
        }, 1000);
      },
      (error: HttpErrorResponse) =>
        fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
    );
  }));
});