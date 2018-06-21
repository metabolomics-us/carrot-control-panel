export class Annotation {
  retentionIndex: number;
  intensity: number;
  replaced: boolean;
  mass: number;

  constructor(retentionIndex: number, intensity: number, replaced: boolean, mass: number) {
    this.retentionIndex = retentionIndex;
    this.intensity = intensity;
    this.replaced = replaced;
    this.mass = mass;
  }
}