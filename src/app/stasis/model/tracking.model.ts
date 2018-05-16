import { TrackingStatus } from './tracking.status.model';

export class Tracking {
  id: string;
  sample: string;
  status: Array<TrackingStatus>;
}