import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { SampleData } from './model/sampledata.model';
import { Acquisition } from './model/acquisition.model';
import { Metadata } from './model/metadata.model';
import { Userdata } from './model/userdata.model';

import { StasisService } from './stasis.service';

// Define sample filename as global variable
let filename = "test"+ Date.now();

describe('StatisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ StasisService ]
    });
  });

  it('should be created', inject([StasisService], (service: StasisService) => {
    expect(service).toBeTruthy();
  }));

  it('should create/get acquisition', inject([StasisService], (service: StasisService) => {
    let sampleData: SampleData = new SampleData(
      filename,
      new Acquisition('instrument A', 'GCTOF', 'positive', 'gcms'),
      new Metadata('123456', 'rat', 'tissue'),
      new Userdata('file123', '')
    );

    service.createAcquisition(sampleData).subscribe(
      response => {
        // Pull created sample acquisition
        setTimeout(() => {
          service.getAcquisition(filename).subscribe(
            response => {

              expect(response).not.toBeNull();
              expect(response.id).toEqual(filename);
              expect(response.metadata).toEqual(sampleData.metadata);
              expect(response.userdata).toEqual(sampleData.userdata);
            },
            error => {
              fail('HTTP GET request failed: '+ error);
            }
          );
        }, 1000);

        expect(response).not.toBeNull();
        expect(response.id).toEqual(filename);
        expect(response.metadata).toEqual(sampleData.metadata);
        expect(response.userdata).toEqual(sampleData.userdata);
      },
      error => {
        fail('HTTP POST request failed: '+ error);
      }
    );
  }));

  it('should create/get tracking', inject([StasisService], (service: StasisService) => {
    service.addTracking(filename, 'entered').subscribe(
      response => {
        // Pull created sample tracking data
        setTimeout(() => {
          service.getTracking(filename).subscribe(
            response => {
              console.log(response)
              expect(response.id).toEqual(filename);
              expect(response.status[0].value).toEqual('entered');
            },
            error => {
              fail('HTTP GET request failed: '+ error);
            }
          );
        }, 1000);

        expect(response.id).toEqual(filename);
        expect(response.status[0].value).toEqual('entered');
      },
      error => {
        fail('HTTP POST request failed: '+ error);
      }
    );
  }));

  it('should create/get a result', inject([StasisService], (service: StasisService) => {
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
            console.log('Calling getResults');

            service.getResults(filename).subscribe(
              response => {
                expect(response['sample']).toEqual(filename);
                expect(response['injections'].length[0]).toBeGreaterThan(0);
              },
              error => {
                fail('HTTP GET request failed: '+ error);
              }
            );
          }, 1000);
          
          // Soft accessing of keys is necessary without a domain object
          expect(response['sample']).toEqual(filename);
          expect(response['injections'].length[0]).toBeGreaterThan(0);
        },
        error => {
          fail('HTTP POST request failed: '+ error);
        }
      );
  }));
});