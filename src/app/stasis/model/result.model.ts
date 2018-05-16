import { Injection } from './result.injection.model';

export class ResultData {
  sample: string;
  injections: Object;

  constructor(sample: string, injections: Object) {
    this.sample = sample;
    this.injections = injections;
  }
}