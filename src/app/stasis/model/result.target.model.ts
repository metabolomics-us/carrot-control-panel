export class Target {
  retentionIndex: number;
  name: string;
  id: string;
  mass: number;

  constructor(retentionIndex: number, name: string, id: string, mass: number) {
    this.retentionIndex = retentionIndex;
    this.name = name;
    this.id = id;
    this.mass = mass;
  }
}