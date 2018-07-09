import { DataSource } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface RiCorrectionTableItem {
  x: number,
  y: number
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: RiCorrectionTableItem[] = [
  {
    "x": 47.579002380371094,
    "y": 46.71000289916992
  },
  {
    "x": 62.55000305175782,
    "y": 63.34199523925781
  },
  {
    "x": 82.01200103759766,
    "y": 81.03600311279297
  },
  {
    "x": 111.45600128173828,
    "y": 111.15599822998047
  },
  {
    "x": 183.31700134277344,
    "y": 182.3159942626953
  },
  {
    "x": 190.80299377441406,
    "y": 190.42201232910156
  },
  {
    "x": 211.26400756835938,
    "y": 211.1639862060547
  },
  {
    "x": 257.1759948730469,
    "y": 255.70201110839844
  },
  {
    "x": 291.1099853515625,
    "y": 288.5639953613281
  },
  {
    "x": 306.08099365234375,
    "y": 303.822021484375
  },
  {
    "x": 361.4750061035156,
    "y": 356.3160095214844
  },
  {
    "x": 380.43798828125,
    "y": 376.10400390625
  },
  {
    "x": 666.3880004882812,
    "y": 661.3200073242188
  },
  {
    "x": 708.8060302734375,
    "y": 702.9960327148438
  }
];

/**
 * Data source for the NgTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RiCorrectionTableDataSource extends DataSource<RiCorrectionTableItem> {
  data: RiCorrectionTableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<RiCorrectionTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    
    return observableOf(this.data)
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
