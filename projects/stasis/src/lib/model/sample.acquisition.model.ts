export class Acquisition {
  instrument: string;
  ionisation: string;
  method: string;
  column: string;

  constructor(instrument: string, ionisation: string, method: string, column: string = 'test') {
    this.instrument = instrument;
    this.ionisation = ionisation;
    this.method = method;
    this.column = column;
  }

  toString() {
    return `${this.method} | ${this.instrument} | ${this.column} | ${this.ionisation}`;
  }
}