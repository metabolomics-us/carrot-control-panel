import { TrackingStatus } from "./tracking.status.model";

export class ExperimentItem {
    experiment: string;
    id: string;
    sample: string;
    status: Array<TrackingStatus>
}
