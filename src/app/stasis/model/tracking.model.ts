export class Tracking {
  id: string;
  sample: string;
  status: Array<Status>;
}

class Status {
	time: number;
  value: string;
  priority: number;
}