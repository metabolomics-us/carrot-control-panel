import {Injectable} from '@angular/core';

import * as seedrandom from 'seedrandom';

@Injectable()
export class AcquisitionTableService {

  constructor() { }

  generateAcquisitionTable(params) {
    // Generate acquisition table
    let acquisitionTable = [];

    let pad = n => ('' + n).padStart(3, '0')

    let formatSampleName = (sample, i) => {
      return params.prefix + pad(i) +'_MX'+ params.miniXID +'_{METHOD}_'+ sample.userdata.label;
    }

    let formatQCName = (label, i, frequency) => {
      return label + pad(i == 1 ? 1 : Math.ceil(i / frequency) + 1) +'_MX'+ params.miniXID
        +'_{METHOD}_' + (i == 1 ? 'pre' : 'post') + params.prefix + pad(i);
    }

    // Randomize sample list if required
    let sampleData = params.randomize ? this.randomizeArray(params.sampleData, params.miniXID) : params.sampleData;
    params.acquisitionData = [];

    // Loop over all samples and generate filenames
    sampleData.forEach((sample, i) => {
      // Process samples
      if (i > 0) {
        sample.filename = formatSampleName(sample, i + 1);
        params.acquisitionData.push(sample);
      }

      // Handle blanks and QCs
      if (params.blank.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % params.blank.frequency == 0)) {
        params.acquisitionData.push({
          filename: formatQCName(params.blank.label, i + 1, params.blank.frequency)
        })
      }

      if (params.qc.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % params.qc.frequency == 0)) {
        params.acquisitionData.push({
          filename: formatQCName(params.qc.label, i + 1, params.qc.frequency)
        });
      }

      if (params.qc2.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % params.qc2.frequency == 0)) {
        params.acquisitionData.push({
          filename: formatQCName(params.qc2.label, i + 1, params.qc2.frequency)
        });
      }

      // Handle first sample in list since it comes after the pre samples
      if (i == 0) {
        sample.filename = formatSampleName(sample, i + 1);
        params.acquisitionData.push(sample);
      }
    });
  }

  /**
   * Uses the Fisher-Yates (aka Knuth) Shuffle
   * https://stackoverflow.com/a/2450976/406772
   */
  randomizeArray(array, seed) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    let rng = seed ? seedrandom(seed) : seedrandom();

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(rng() * currentIndex);
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
