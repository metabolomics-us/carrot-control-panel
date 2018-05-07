import { async, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MiniXService } from './minix.service';

import { parseString } from 'xml2js';


describe('Service: MiniXService', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ MiniXService ]
    });

    service = TestBed.get(MiniXService);
  });

  it('should return a JSON converted MiniX export', async(() => {
    service.getMiniXExport(400333, (error, result) => {
      expect(result).not.toBeNull();
      expect(result.experiment).not.toBeNull();
    });
  }));
});
