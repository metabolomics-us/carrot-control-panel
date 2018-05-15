import { Acquisition } from './acquisition.model';
import { Metadata } from './metadata.model';
import { Userdata } from './userdata.model';

export class SampleData {
  id: string;
  sample: string;
  acquisition: Acquisition;
  metadata: Metadata;
  userdata: Userdata;

  constructor(sample: string, acquisition: Acquisition, metadata: Metadata, userdata: Userdata) {
    this.sample = sample;
    this.acquisition = acquisition;
    this.metadata = metadata;
    this.userdata = userdata;
  }
}