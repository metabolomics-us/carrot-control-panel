import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getType'
})
export class GetTypePipe implements PipeTransform {
  transform(obj: any): string {
    return typeof obj;
  }
}
