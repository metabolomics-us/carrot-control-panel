import {Injectable} from '@angular/core';

import * as cloneDeep from 'lodash/cloneDeep';
import * as seedrandom from 'seedrandom';

@Injectable()
export class AcquisitionTableService {

  constructor() { }

  /**
   * Creates acqusition data for GC-MS experiment
   */
  generateGCMSAcquisitionTable(data) {
    // Use MiniX ID + current date as the filename prefix
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const instrumentID = data.ionizations.pos.charAt(data.ionizations.pos.length - 2);

    data.filename_prefix = 'MX' + data.miniXID + '_' + date + instrumentID + data.operator;

    // Randomize sample list if required
    const sampleData = data.randomize ? this.randomizeArray(data.sampleData, data.miniXID) : data.sampleData;
    data.acquisitionData = [];

    let blankNum = 0;
    let qcNum = 0;

    // Creates proper sample filenames from the filename format
    const generateSampleName = (sample, type, n) => {
      sample.filename = data.filename_prefix + type + this.padNumber(n, 2);
      sample.ionizations = {pos: sample.filename};
      return sample;
    };

    // Loop over all samples and generate filenames
    sampleData.forEach((sample, i) => {
      // Process samples after the first
      if (i > 0) {
        data.acquisitionData.push(generateSampleName(sample, 'sa', i + 1));
      }

      // Handle blanks when the option is enabled
      if (data.blank.enabled && (i === 0 || i === sampleData.length - 1 || (i + 1) % data.blank.frequency === 0)) {
        // Use the number of pre-injections if this is before the first sample
        const n = (i === 0) ? data.blank.pre : 1;

        for (let j = n; j > 0; j--) {
          data.acquisitionData.push(generateSampleName({}, 'bl', blankNum + j));
        }

        blankNum += n;
      }

      // Handle QCs when the option is enabled
      if (data.qc.enabled && (i === 0 || i === sampleData.length - 1 || (i + 1) % data.qc.frequency === 0)) {
        // Use the number of pre-injections if this is before the first sample
        const n = (i === 0) ? data.qc.pre : 1;

        for (let j = n; j > 0; j--) {
          data.acquisitionData.push(generateSampleName({}, 'qc', qcNum + j));
        }

        qcNum += n;
      }

      // Handle first sample in list since it comes after the pre samples
      if (i === 0) {
        data.acquisitionData.push(generateSampleName(sample, 'sa', i + 1));
      }
    });
  }

  /**
   * Creates acqusition data for LC-MS experiment
   */
  generateLCMSAcquisitionTable(data) {
    // Filenames should match:
    //   [A-Za-z]+(\d{3,4}|_MSMS)_MX\d+_[A-Za-z]+_[A-Za-z0-9-]+(_\d+_\d+)?
    const formatSampleName = (sample, i) => {
      return data.prefix + this.padNumber(i) + '_MX' + data.miniXID + '_{METHOD}_' +
        sample.userdata.label.replace(/[^A-Za-z0-9]/g, '-');
    };

    const formatQCName = (label, i, frequency) => {
      return label + this.padNumber(i === 1 ? 1 : Math.ceil(i / frequency) + 1) + '_MX' + data.miniXID
        + '_{METHOD}_' + (i === 1 ? 'pre' : 'post') + data.prefix + this.padNumber(i);
    };

    // Reorder sample list and filter by matrix if required
    const sampleData = (() => {
      // Use only samples corresponding to a single matrix if specified
      // For all samples, perform shallow copy so that data.sample retains its original order
      const samples = data.matrix === 'all' ? [...data.sampleData] : data.samplesByMatrix[data.matrix];

      if (data.randomize === 'randomize') {
        // Use a predictable randomization using the MiniX id as the seed
        return this.randomizeArray(samples, data.miniXID);
      } else if (data.randomize === 'sort') {
        const label_prefixes = samples.map(x => x.userdata.label.split('_')[0]);

        if (label_prefixes.every(x => !isNaN(x))) {
          // Sort by the integer value of the label prefix if all prefixes are numeric
          samples.forEach(x => x.label_prefix = parseInt(x.userdata.label.split('_')[0], 10));
          return samples.sort((a, b) => a.label_prefix < b.label_prefix ? -1 : a.label_prefix > b.label_prefix ? 1 : 0);
        } else {
          // Otherwise sort by string value of the label
          return samples.sort((a, b) => a.userdata.label.localeCompare(b.userdata.label));
        }
      } else if (data.randomize === 'custom') {
        // Used custom ordering provided by the user
        const samplesByLabel = {};
        samples.forEach(x => samplesByLabel[x.userdata.label] = x);

        const orderedSamples = [];
        data.customOrdering.forEach(x => orderedSamples.push(samplesByLabel[x]));

        return orderedSamples;
      } else {
        // Use the default ordering of samples in the MiniX study
        return samples;
      }
    })();


    data.acquisitionData = [];

    // Loop over all samples and generate filenames
    sampleData.forEach((sample, i) => {
      // Process samples after the first
      if (i > 0) {
        sample.filename = formatSampleName(sample, i + 1);
        data.acquisitionData.push(this.generateLCMSSampleNames(data, sample));
      }

      // Handle blanks and QCs when the option is enabled
      const blankQCs = data.blanksFirst ?
        [data.blank, data.qc, data.pooledQC, data.qc2] : [data.qc, data.pooledQC, data.blank, data.qc2];

      blankQCs.forEach((x) => {
        if (x.enabled && (i === 0 || i === sampleData.length - 1 || (i + 1) % x.frequency === 0)) {
          data.acquisitionData.push(this.generateLCMSSampleNames(data, {
            filename: formatQCName(x.label, i + 1, x.frequency)
          }));
        }
      });

      // Handle first sample in list since it comes after the pre samples
      if (i === 0) {
        sample.filename = formatSampleName(sample, i + 1);
        data.acquisitionData.push(this.generateLCMSSampleNames(data, sample));
      }
    });
  }

  /**
   * Creates proper sample filenames for each ionization mode from the filename format
   */
  generateLCMSSampleNames(data, sample) {
    // Create an ionizations field for each sample so that we can store multiple filenames
    if (!sample.hasOwnProperty('ionizations')) {
      sample.ionizations = {};
    }

    Object.keys(data.ionizations).map(mode => {
        const method = mode + data.platform;
        sample.ionizations[mode] = sample.filename.replace('{METHOD}', method);
    });

    return sample;
  }

  /**
   * Uses the Fisher-Yates (aka Knuth) Shuffle
   * https://stackoverflow.com/a/2450976/406772
   */
  randomizeArray(array, seed) {
    const clonedArray = cloneDeep(array);

    const rng = seed ? seedrandom(seed) : seedrandom();
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(rng() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = clonedArray[currentIndex];
      clonedArray[currentIndex] = clonedArray[randomIndex];
      clonedArray[randomIndex] = temporaryValue;
    }

    return clonedArray;
  }

  /**
   * Generate an array from 1 to n
   */
  generateSampleNumbers(n: number) {
    return Array.from({length: n}, (v, k) => k + 1);
  }

  /**
   * Pad the sample number n with 0s to make it a k-digit string
   */
  padNumber(n: number, k: number = 3) {
    return ('' + n).padStart(k, '0');
  }
}
