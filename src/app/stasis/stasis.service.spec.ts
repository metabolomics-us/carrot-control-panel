import { async, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

import { SampleData } from './model/sampledata.model';
import { Acquisition } from './model/acquisition.model';
import { Metadata } from './model/metadata.model';
import { Userdata } from './model/userdata.model';

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
      new Acquisition('instrument A', 'GCTOF', 'positive', 'gcms'),
      new Metadata('123456', 'rat', 'tissue'),
      new Userdata('file123', '')
    );

    service.createAcquisition(sampleData).subscribe(
      response => {
        expect(response).not.toBeNull();
        expect(response.id).toEqual(filename);
        expect(response.userdata.label).toEqual(sampleData.userdata.label);

        // Pull created sample acquisition
        setTimeout(() => {
          service.getAcquisition(filename).subscribe(
            response => {
              expect(response).not.toBeNull();
              expect(response.id).toEqual(filename);
              expect(response.userdata.label).toEqual(sampleData.userdata.label);
            },
            (error: HttpErrorResponse) =>
              fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
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
              fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
          );
        }, 1000);
      },
      (error: HttpErrorResponse) =>
        fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
    );
  }));

  it('should create/get result', async(() => {
    expect(service).toBeTruthy();

    let resultData = {
      sample: filename,
      injections: {
        'test_1': {
          logid: 'R2D2',
          correction: {
            polynomial: 5,
            sampleUsed: 'test',
            curve: [
              {x: 121.12, y: 121.2},
              {x: 123.12, y: 123.2}
            ]
          },
          results: [
            {
              target: {
                retentionIndex: 121.12,
                name: 'test',
                id: 'test_id',
                mass: 12.2
              },
              annotation: {
                retentionIndex: 121.12,
                intensity: 10.0,
                replaced: false,
                mass: 12.2
              }
            },
            {
              target: {
                retentionIndex: 123.12,
                name: 'test2',
                id: 'test_id2',
                mass: 132.12
              },
              annotation: {
                retentionIndex: 123.2,
                intensity: 103.0,
                replaced: true,
                mass: 132.12
              }
            }
          ]
        }
      }
    };

    service.addResult(resultData).subscribe(
      response => {
        // Pull created sample result data
        setTimeout(() => {
          // Soft accessing of keys is necessary without a domain object
          expect(response['sample']).toEqual(filename);
          expect(Object.keys(response['injections']).length).toBeGreaterThan(0);

          service.getResults(filename).subscribe(
            response => {
              expect(response['sample']).toEqual(filename);
              expect(Object.keys(response['injections']).length).toBeGreaterThan(0);
            },
            (error: HttpErrorResponse) =>
              fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
          );
        }, 1000);
      },
      (error: HttpErrorResponse) =>
        fail(error.status == 0 ? 'CORS Error' : 'HTTP POST error: '+ JSON.stringify(error))
    );
  }));
});