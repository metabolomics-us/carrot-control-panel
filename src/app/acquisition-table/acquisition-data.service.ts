import {Injectable} from '@angular/core';

@Injectable()
export class AcquisitionDataService {

  constructor() { }

  /**
   * Get a list of all LCMS methods
   */
   getLCMSMethods(): Array<string> {
     return ['CSH', 'HILIC', 'RP'];
   }

  /**
   * Get a list of all LCMS instruments
   */
   getLCMSInstruments(): Array<string> {
     return [
       'Agilent QTOF 6530 (g)',
       'Agilent QTOF 6550 (e)',
       'Agilent QTOF 7200 (f)',
       'CORE Agilent QTOF 6530b (i)',
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
