export class Acquisition {
  instrument: string;
  name: string;
  ionisation: string;
  method: string;

  constructor(instrument: string, name: string, ionisation: string, method: string) {
    this.instrument = instrument;
    this.name = name;
    this.ionisation = ionisation;
    this.method = method;
  }
}