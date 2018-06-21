export class Acquisition {
  instrument: string;
  ionisation: string;
  method: string;

  constructor(instrument: string, ionisation: string, method: string) {
    this.instrument = instrument;
    this.ionisation = ionisation;
    this.method = method;
  }
}