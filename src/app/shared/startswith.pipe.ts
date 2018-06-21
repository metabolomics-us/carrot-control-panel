import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'startswith'
})
export class StartsWithPipe implements PipeTransform {
    transform(items: any[], filterString: string): any {
        if (!items)
          return [];
        if (!filterString)
          return items;

        filterString = filterString.toLowerCase();

        return items.filter(s => {
          return s.toLowerCase().startsWith(filterString);
        });
    }
}