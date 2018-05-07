import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { parseString } from 'xml2js';


@Injectable()
export class MiniXService {

  constructor(private http: HttpClient) { }

  getMiniXExport(minixID: number, callback: Function) {
    return this.http.get(
      'http://localhost:1337/minix.fiehnlab.ucdavis.edu/rest/export/'+ minixID,
      {responseType: 'text'}
    ).subscribe((result: string) => parseString(result, callback));
    // ).pipe(map((res: any) => {
    //   parseString(res, callback));
    // }));
  }
}
