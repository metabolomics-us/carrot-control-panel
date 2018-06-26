import { Acquisition } from './sample.acquisition.model';
import { Processing } from './sample.processing.model';
import { Metadata } from './sample.metadata.model';
import { Reference } from './sample.reference.model';
import { Userdata } from './sample.userdata.model';

export class SampleData {
  id: string;
  sample: string;
  experiment: string;
  acquisition: Acquisition;
  processing: Processing;
  metadata: Metadata;
  userdata: Userdata;
  references: Array<Reference>;

  constructor(sample: string, experiment: string, acquisition: Acquisition,
      processing: Processing, metadata: Metadata, userdata: Userdata, references: Array<Reference>) {

    this.sample = sample;
    this.experiment = experiment;
    this.acquisition = acquisition;
    this.processing = processing;
    this.metadata = metadata;
    this.userdata = userdata;
    this.references = references;
  }
}