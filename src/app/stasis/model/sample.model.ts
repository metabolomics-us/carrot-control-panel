import { Acquisition } from './sample.acquisition.model';
import { Processing } from './sample.processing.model';
import { Metadata } from './sample.metadata.model';
import { Userdata } from './sample.userdata.model';

export class SampleData {
  id: string;
  sample: string;
  acquisition: Acquisition;
  processing: Processing;
  metadata: Metadata;
  userdata: Userdata;
  references: Object;

  constructor(sample: string, acquisition: Acquisition, processing: Processing, 
      metadata: Metadata, userdata: Userdata, references: Object) {

    this.sample = sample;
    this.acquisition = acquisition;
    this.processing = processing;
    this.metadata = metadata;
    this.userdata = userdata;
    this.references = references;
  }
}