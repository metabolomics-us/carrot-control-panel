import { Target } from './result.target.model';
import { Annotation } from './result.annotation.model';

export class Result {
  target: Target;
  annotation: Annotation;

  constructor(target: Target, annotation: Annotation) {
    this.target = target;
    this.annotation = annotation;
  }
}