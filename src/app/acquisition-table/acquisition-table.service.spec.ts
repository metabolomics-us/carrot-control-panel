import { async, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AcquisitionTableService } from './acquisition-table.service';
import { MiniXService } from '../minix/minix.service';

describe('Service: AcquisitionTableService', () => {
  let service;
  let miniXService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ AcquisitionTableService, MiniXService ]
    });

    service = TestBed.get(AcquisitionTableService);
    miniXService = TestBed.get(MiniXService);
  });

  it('should shuffle an array of numbers', async(() => {
    var sampleNumbers = service.generateSampleNumbers(100);
    var result = service.randomizeArray(sampleNumbers.slice(0));
    expect(sampleNumbers).not.toBe(result);
  }));

  it('should generate acquisition table for MX373065', async(() => {
    var data = {
      prefix: 'Connor',
      miniXID: 373065,
      platform: 'HILIC',
      ionizations: [
        'pos'
      ],
      blank: {
        enabled: true,
        label: 'MtdBlank',
        frequency: 10
      },
      qc: {
        enabled: true,
        label: 'BioRec',
        frequency: 10
      },
      nist: {
        enabled: false,
        label: 'NIST',
        frequency: 100
      },
      msms: {
        enabled: true,
        number: 4
      },
      randomize: true,
      sampleData: []
    };

    miniXService.getMiniXExport(data.miniXID, (error, result) => {
      data.sampleData = miniXService.parseMiniXSamples(result);

      var result = service.generateAcquisitionTable(data);
      console.log(result);
    });
  }));
});
