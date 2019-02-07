import {async, TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';

import {AcquisitionTableService} from './acquisition-table.service';
import {MiniXService} from '../../shared/services/minix/minix.service';

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
    const sampleNumbers = service.generateSampleNumbers(100);
    const result = service.randomizeArray(sampleNumbers.slice(0));
    expect(sampleNumbers).not.toBe(result);
  }));

  it('should generate acquisition table for MX373065', async(() => {
    const data = {
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
      qc2: {
        enabled: false,
        label: 'NIST',
        frequency: 100
      },
      pooledQC: {
        enabled: true,
        label: 'PoolQC',
        frequency: 10
      },
      randomize: true,
      blanksFirst: true,
      sampleData: [],
      acquisitionData: []
    };

    // Test filename generation with randomization
    miniXService.getMiniXExport(data.miniXID, (error, result) => {
      data.sampleData = miniXService.parseMiniXSamples(result);

      const expectedFilenames = [
        'MtdBlank001_MX373065_{METHOD}_preConnor001',
        'BioRec001_MX373065_{METHOD}_preConnor001',
        'PoolQC001_MX373065_{METHOD}_preConnor001',
        'Connor001_MX373065_{METHOD}_LGG-W-001',
        'Connor002_MX373065_{METHOD}_LGG-W-002',
        'Connor003_MX373065_{METHOD}_LGG-G-004',
        'Connor004_MX373065_{METHOD}_LGG-G-005',
        'Connor005_MX373065_{METHOD}_LGG-G-006',
        'Connor006_MX373065_{METHOD}_LGG-W-003',
        'MtdBlank002_MX373065_{METHOD}_postConnor006',
        'BioRec002_MX373065_{METHOD}_postConnor006',
        'PoolQC002_MX373065_{METHOD}_postConnor006',
      ];

      service.generateLCMSAcquisitionTable(data);
      expect(data.acquisitionData.map(x => x.filename)).toEqual(expectedFilenames);
    });

    // Test filename generation without randomization
    miniXService.getMiniXExport(data.miniXID, (error, result) => {
      data.sampleData = miniXService.parseMiniXSamples(result);

      const expectedFilenames = [
        'MtdBlank001_MX373065_{METHOD}_preConnor001',
        'BioRec001_MX373065_{METHOD}_preConnor001',
        'PoolQC001_MX373065_{METHOD}_preConnor001',
        'Connor001_MX373065_{METHOD}_LGG-W-001',
        'Connor002_MX373065_{METHOD}_LGG-W-002',
        'Connor003_MX373065_{METHOD}_LGG-W-003',
        'Connor004_MX373065_{METHOD}_LGG-G-004',
        'Connor005_MX373065_{METHOD}_LGG-G-005',
        'Connor006_MX373065_{METHOD}_LGG-G-006',
        'MtdBlank002_MX373065_{METHOD}_postConnor006',
        'BioRec002_MX373065_{METHOD}_postConnor006',
        'PoolQC002_MX373065_{METHOD}_postConnor006',
      ];

      data.randomize = false;
      service.generateLCMSAcquisitionTable(data);
      expect(data.acquisitionData.map(x => x.filename)).toEqual(expectedFilenames);
    });
  }));
});
