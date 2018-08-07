import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { parseString } from 'xml2js';

@Injectable()
export class MiniXService {

  constructor(private http: HttpClient) { }

  getMiniXExport(minixID: number, callback: Function, errorCallback: (error: any) => void) {
    return this.http.get(
      '/rest/export/'+ minixID,
      {responseType: 'text'}
    ).subscribe((result: string) => parseString(result, callback), errorCallback);
  }

  getMiniXJSONExport(minixID: number) {
    return this.http.get('rest/integration/minix/'+ minixID);
  }

  parseMiniXSamples(miniXData) {
    let miniXID = miniXData.experiment.$.id;
    let sampleData = [];

    // Compile sample data
    miniXData.experiment.classes[0].class.forEach(c => {
      let samples = c.samples[0].sample;
      samples.sort((a, b) => a.$.id - b.$.id);

      samples.forEach(sample => {
        // Only keep samples with an associated label
        if (sample.$.label) {
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
        }
      });
    });

    return sampleData;
  }
}
