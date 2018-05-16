import { Acquisition } from './sample.acquisition.model';
import { Metadata } from './sample.metadata.model';
import { Userdata } from './sample.userdata.model';

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