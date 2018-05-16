import { TrackingStatus } from './tracking.status.model';

export class TrackingData {
  id: string;
  sample: string;
  status: Array<TrackingStatus>;
}