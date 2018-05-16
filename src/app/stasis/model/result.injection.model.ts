import { Correction } from './result.correction.model';
import { Result } from './result.result.model';

export class Injection {
  logid: string;
  correction: Correction;
  results: Array<Result>;

  constructor(logid: string, correction: Correction, results: Array<Result>) {
    this.logid = logid;
    this.correction = correction;
    this.results = results;
  }
}