import { CorrectionPoint } from './result.correction.point.model';

export class Correction {
  polynomial: number;
  sampleUsed: string;
  curve: Array<CorrectionPoint>;

  constructor(polynomial: number, sampleUsed: string, curve: Array<CorrectionPoint>) {
    this.polynomial = polynomial;
    this.sampleUsed = sampleUsed;
    this.curve = curve;
  }
}