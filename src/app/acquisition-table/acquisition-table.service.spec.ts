import {async, TestBed} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';

import {AcquisitionTableService} from './acquisition-table.service';
import {MiniXService} from '../minix/minix.service';

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
    let data = {
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
      randomize: true,
      sampleData: [],
      acquisitionData: []
    };

    // Test filename generation with randomization
    miniXService.getMiniXExport(data.miniXID, (error, result) => {
      data.sampleData = miniXService.parseMiniXSamples(result);

      const expectedFilenames = [
        "MtdBlank001_MX373065_{METHOD}_preConnor001",
        "BioRec001_MX373065_{METHOD}_preConnor001",
        "Connor001_MX373065_{METHOD}_LGG-W_001",
        "Connor002_MX373065_{METHOD}_LGG-W_002",
        "Connor003_MX373065_{METHOD}_LGG-G_004",
        "Connor004_MX373065_{METHOD}_LGG-G_005",
        "Connor005_MX373065_{METHOD}_LGG-G_006",
        "Connor006_MX373065_{METHOD}_LGG-W_003",
        "MtdBlank002_MX373065_{METHOD}_postConnor006",
        "BioRec002_MX373065_{METHOD}_postConnor006"
      ];

      service.generateAcquisitionTable(data);
      expect(data.acquisitionData.map(x => x.filename)).toEqual(expectedFilenames);
    });

    // Test filename generation without randomization
    miniXService.getMiniXExport(data.miniXID, (error, result) => {
      data.sampleData = miniXService.parseMiniXSamples(result);

      const expectedFilenames = [
        "MtdBlank001_MX373065_{METHOD}_preConnor001",
        "BioRec001_MX373065_{METHOD}_preConnor001",
        "Connor001_MX373065_{METHOD}_LGG-W_001",
        "Connor002_MX373065_{METHOD}_LGG-W_002",
        "Connor003_MX373065_{METHOD}_LGG-W_003",
        "Connor004_MX373065_{METHOD}_LGG-G_004",
        "Connor005_MX373065_{METHOD}_LGG-G_005",
        "Connor006_MX373065_{METHOD}_LGG-G_006",
        "MtdBlank002_MX373065_{METHOD}_postConnor006",
        "BioRec002_MX373065_{METHOD}_postConnor006"
      ];

      data.randomize = false;
      service.generateAcquisitionTable(data);
      expect(data.acquisitionData.map(x => x.filename)).toEqual(expectedFilenames);
    });
  }));
});
