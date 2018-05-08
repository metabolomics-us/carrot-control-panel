import { Injectable } from '@angular/core';

@Injectable()
export class AcquisitionTableService {

  constructor() { }

  generateAcquisitionTable(miniXID, sampleData, params) {
    console.log(params);

    // Generate acquisition table
    var acquisitionTable = [];

    var pad = n => ('' + n).padStart(3, '0')

    var formatSampleName = (sample, i) => {
      return miniXID +'_'+ params.prefix + pad(i) +'_'+ params.methods[0]
        +'_'+ sample.userdata.label;
    }

    var formatQCName = (label, i, frequency) => {
      return miniXID +'_'+ label + pad(i == 1 ? i : Math.ceil(i / frequency)) +'_'+
        params.methods[0] +'_'+ (i == 1 ? 'pre' : 'post') + params.prefix + pad(i);
    }

    var fileNames = [];

    this.generateRandomizedArray(sampleData).forEach((sample, i) => {
      if (params.blank.enabled && (i == 0 || (i + 1) % params.blank.frequency == 0)) {
        fileNames.push(formatQCName(params.blank.label, i + 1, params.blank.frequency))
      }

      if (params.qc.enabled && (i == 0 || (i + 1) % params.qc.frequency == 0)) {
        fileNames.push(formatQCName(params.qc.label, i + 1, params.qc.frequency))
      }

      if (params.nist.enabled && (i == 0 || (i + 1) % params.nist.frequency == 0)) {
        fileNames.push(formatQCName(params.nist.label, i + 1, params.nist.frequency))
      }

      fileNames.push(formatSampleName(sample, i + 1));

      if (params.blank.enabled && i == sampleData.length - 1) {
        fileNames.push(formatQCName(params.blank.label, i + 1, params.blank.frequency))
      }

      if (params.qc.enabled && i == sampleData.length - 1) {
        fileNames.push(formatQCName(params.qc.label, i + 1, params.qc.frequency))
      }
    });

    if (params.msms.enabled) {

    }

    console.log(fileNames)
  }

  /**
   * Uses the Fisher-Yates (aka Knuth) Shuffle
   * https://stackoverflow.com/a/2450976/406772
   */
  generateRandomizedArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Generate an array from 1 to n
   */
  generateSampleNumbers(n: number) {
    return Array.from({length: n}, (v, k) => k+1);
  }
}
