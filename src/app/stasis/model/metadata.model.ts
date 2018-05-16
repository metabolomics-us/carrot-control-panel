export class Metadata {
  class: string;
  species: string;
  organ: string;

  constructor(cl: string, species: string, organ: string) {
    this.class = cl;
    this.species = species;
    this.organ = organ;
  }
}