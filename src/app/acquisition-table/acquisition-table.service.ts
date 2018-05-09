import { Injectable } from '@angular/core';

@Injectable()
export class AcquisitionTableService {

  constructor() { }

  generateAcquisitionTable(params) {
    console.log(params);

    // Generate acquisition table
    var acquisitionTable = [];

    var pad = n => ('' + n).padStart(3, '0')

    var formatSampleName = (sample, i) => {
      return params.prefix + pad(i) +'_MX'+ params.miniXID +'_{METHOD}_'+ sample.userdata.label;
    }

    var formatQCName = (label, i, frequency) => {
      return label + pad(i == 1 ? 1 : Math.ceil(i / frequency) + 1) +'_MX'+ params.miniXID +'_'+ 
        '_{METHOD}_' + (i == 1 ? 'pre' : 'post') + params.prefix + pad(i);
    }

    // Randomize sample list if required
    var sampleData = params.randomize ? this.randomizeArray(params.sampleData) : params.sampleData;
    params.sampleData = [];

    // Loop over all samples and generate filenames
    sampleData.forEach((sample, i) => {
      // Process samples
      if (i > 0) {
        sample.filename = formatSampleName(sample, i + 1);
        params.sampleData.push(sample);
      }

      // Handle blanks and QCs
      if (params.blank.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % params.blank.frequency == 0)) {
        params.sampleData.push({
          filename: formatQCName(params.blank.label, i + 1, params.blank.frequency)
        })
      }

      if (params.qc.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % params.qc.frequency == 0)) {
        params.sampleData.push({
          filename: formatQCName(params.qc.label, i + 1, params.qc.frequency)
        });
      }

      if (params.nist.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % params.nist.frequency == 0)) {
        params.sampleData.push({
          filename: formatQCName(params.nist.label, i + 1, params.nist.frequency)
        });
      }

      // Handle first sample in list since it comes after the pre samples
      if (i == 0) {
        sample.filename = formatSampleName(sample, i + 1);
        params.sampleData.push(sample);
      }
    });
  }

  /**
   * Uses the Fisher-Yates (aka Knuth) Shuffle
   * https://stackoverflow.com/a/2450976/406772
   */
  randomizeArray(array) {
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
