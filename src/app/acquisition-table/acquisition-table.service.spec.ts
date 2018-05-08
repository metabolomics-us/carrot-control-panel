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
    var result = service.generateRandomizedArray(sampleNumbers.slice(0));
    expect(sampleNumbers).not.toBe(result);
  }));

  it('should generate acquisition table for MX373065', async(() => {
    var acquisitionParameters = {
      prefix: 'Connor',
      miniXID: 373065,
      methods: [
        'posHILIC'
      ],
      methodBlank: {
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
      }
    };

    miniXService.getMiniXExport(acquisitionParameters.miniXID, (error, result) => {
      var result = service.generateAcquisitionTable(result, acquisitionParameters);
    });
  }));
});
