import {Injectable} from '@angular/core';

@Injectable()
export class AcquisitionDataService {

  constructor() { }

  /**
   * Get a list of all LCMS methods
   */
  getLCMSPlatforms(): Array<string> {
    return ['CSH', 'HILIC', 'RP'];
  }

  /**
   * Get a list of MS/MS file m/z ranges and filename suffixes for each mode
   */
  getMSMSRanges() {
    return {
      'pos': ['120_700', '700_800', '800_880', '880_1200'],
      'neg': ['60_700', '700_800', '800_880', '880_1200']
    };
  }

  /**
   * Get a list of all LCMS instruments
   */
  getLCMSInstruments(): Array<string> {
    return [
      'Agilent Q-TOF 6530 (g)',
      'Agilent Q-TOF 6550 (e)',
      'Agilent Q-TOF 7200 (f)',
      'CORE Agilent Q-TOF 6530b (i)',
      'Sciex QTRAP 4000',
      'Sciex QTRAP 6500',
      'Sciex TripleTOF 6600 (j)',
      'Thermo Q Exactive (q)'
    ];
  }

  /**
   * Get a list of all GCMS instruments
   */
  getGCMSInstruments(): Array<string> {
    return [
      'CORE GC-TOF (a)',
      'Research GC-TOF (b)',
      'GC-TOF (c)',
      'GC-TOF (d)',
      'GC-TOF BT (t)'
    ];
  }
}
