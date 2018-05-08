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
  }

  parseMiniXSamples(miniXData) {
    var miniXID = miniXData.experiment.$.id;
    var sampleData = [];

    // Compile sample data
    miniXData.experiment.classes[0].class.forEach(c => {
      c.samples[0].sample.forEach(sample => {
        sampleData.push({
          id: sample.$.id,
          minix: miniXID,

          acquisition: {
            instrument: miniXData.experiment.architecture[0].$.name
          },
          metadata: {
            class: c.$.id,
            species: c.$.species,
            organ: c.$.organ
          },
          userdata: {
            label: sample.$.label,
            comment: sample.$.comment
          }
        });
      });
    });

    return sampleData;
  }
}
