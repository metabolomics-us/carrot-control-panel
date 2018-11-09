import { DataSource } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface StatusTableItem {
  status: Status[];
  sample: string;
}

interface Status {
  priority: number;
  value: string;
  time: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: StatusTableItem[] = [
  { 
    sample: 'processed-sample', status: [
      {
        "priority": 1,
        "value": "entered",
        "time": 1530227380079
      },
      {
        "priority": 100,
        "value": "acquired",
        "time": 1530227382720
      },
      {
        "priority": 200,
        "value": "converted",
        "time": 1530227385218
      },
      {
        "priority": 300,
        "value": "processing",
        "time": 1530227387901
      },
      {
        "priority": 310,
        "value": "deconvoluted",
        "time": 1530227390621
      },
      {
        "priority": 320,
        "value": "corrected",
        "time": 1530227393194
      },
      {
        "priority": 330,
        "value": "annotated",
        "time": 1530227395823
      },
      {
        "priority": 340,
        "value": "quantified",
        "time": 1530227398420
      },
      {
        "priority": 350,
        "value": "replaced",
        "time": 1530227401041
      },
      {
        "priority": 400,
        "value": "exported",
        "time": 1530227403781
      }
    ] 
  },
  { 
    sample: 'test_1057744', status: [
      {'priority': 1, 'value': 'entered', 'time': 123456}, 
      {'priority': 2, 'value': 'acquired', 'time': 123456}, 
      {'priority': 3, 'value': 'converted', 'time': 123456}
    ]
  },
];

/**
 * Data source for the StatusTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class StatusTableDataSource extends DataSource<StatusTableItem> {
  data: StatusTableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<StatusTableItem[]> {
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
