import { TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CarrotHttpService } from './carrot.http.service';

describe('CarrotHttpService', () => {

  let service: CarrotHttpService;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        CarrotHttpService,
        {
          provide: 'env',
          useValue: {production: false}
        }
      ]
    });

    service = TestBed.get(CarrotHttpService);
    backend = TestBed.get(HttpTestingController);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('should check the file status', async(() => {
    service.checkFileStatus('test').subscribe((response: any) => {
      expect(response).not.toBeNull();
      expect(response.exist).toBeTruthy();
    });

    // Mock response
    const mockData = {exist: true, file: 'test'};
    const mockRequest = backend.expectOne('/rest/file/exists/test');
    expect(mockRequest.cancelled).toBeFalsy();
    mockRequest.flush(mockData);
    backend.verify();
  }));

  it('should check the file status for a file that does not exist', async(() => {
    service.checkFileStatus('test-does-not-exist').subscribe((response: any) => {
      expect(response).not.toBeNull();
      expect(response.exist).toBeFalsy();
    });

    // Mock response
    const mockData = {exist: false, file: 'test-does-not-exist'};
    const mockRequest = backend.expectOne('/rest/file/exists/test-does-not-exist');
    expect(mockRequest.cancelled).toBeFalsy();
    mockRequest.flush(mockData);
    backend.verify();
  }));

  it('should return a list of available platforms', async(() => {
    service.getPlatforms().subscribe(response => {
      expect(response).not.toBeNull();
      expect(response.length).toBe(2);
    });
  }));

  it('should return a list of available acquisition methods', async(() => {
    service.getAcquisitionMethods().subscribe(response => {
      expect(response).not.toBeNull();
      expect(response.length).toBe(1);
    });

    // Mock response
    const mockData = [
      {
        'chromatographicMethod': {
          'name': 'lcms_istds',
          'instrument': 'test',
          'column': 'test',
          'ionMode': {'mode': 'positive'}
        }
      }
    ];
    const mockRequest = backend.expectOne('/rest/library');
    expect(mockRequest.cancelled).toBeFalsy();
    mockRequest.flush(mockData);
    backend.verify();
  }));
});
