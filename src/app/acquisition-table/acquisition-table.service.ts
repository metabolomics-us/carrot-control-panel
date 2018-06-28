import {Injectable} from '@angular/core';

import * as seedrandom from 'seedrandom';

@Injectable()
export class AcquisitionTableService {

  constructor() { }

  generateAcquisitionTable(data) {
    // Generate acquisition table
    let acquisitionTable = [];

    let pad = n => ('' + n).padStart(3, '0')

    // Filenames should match:
    //   [A-Za-z]+(\d{3,4}|_MSMS)_MX\d+_[A-Za-z]+_[A-Za-z0-9-]+(_\d+_\d+)?
    let formatSampleName = (sample, i) => {
      return data.prefix + pad(i) +'_MX'+ data.miniXID +'_{METHOD}_'+
        sample.userdata.label.replace(/[^A-Za-z0-9]/g, '-');
    }

    let formatQCName = (label, i, frequency) => {
      return label + pad(i == 1 ? 1 : Math.ceil(i / frequency) + 1) +'_MX'+ data.miniXID
        +'_{METHOD}_' + (i == 1 ? 'pre' : 'post') + data.prefix + pad(i);
    }

    // Randomize sample list if required
    let sampleData = data.randomize ? this.randomizeArray(data.sampleData, data.miniXID) : data.sampleData;
    data.acquisitionData = [];

    // Loop over all samples and generate filenames
    sampleData.forEach((sample, i) => {
      // Process samples
      if (i > 0) {
        sample.filename = formatSampleName(sample, i + 1);
        data.acquisitionData.push(this.generateSampleNames(data, sample));
      }

      // Handle blanks and QCs
      [data.blank, data.qc, data.qc2].forEach((x) => {
        if (x.enabled && (i == 0 || i == sampleData.length - 1 || (i + 1) % x.frequency == 0)) {
          data.acquisitionData.push(this.generateSampleNames(data, {
            filename: formatQCName(x.label, i + 1, x.frequency)
          }));
        }
      });

      // Handle first sample in list since it comes after the pre samples
      if (i == 0) {
        sample.filename = formatSampleName(sample, i + 1);
        data.acquisitionData.push(this.generateSampleNames(data, sample));
      }
    });
  }

  /**
   * Creates proper sample filenames for each ionization mode from the filename format
   */
  generateSampleNames(data, sample) {
    // Create an ionizations field for each sample so that we can store multiple filenames
    if (!sample.hasOwnProperty('ionizations'))
      sample.ionizations = {};

    Object.keys(data.ionizations).map(mode => {
        let method = mode + data.platform;
        sample.ionizations[mode] = sample.filename.replace('{METHOD}', method);
    });

    return sample;
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
