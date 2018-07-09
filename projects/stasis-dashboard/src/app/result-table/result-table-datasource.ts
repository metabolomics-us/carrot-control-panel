import { DataSource } from '@angular/cdk/collections';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface ResultTableItem {
  target: target;
  annotation: annotation;
}

interface target {
  retentionIndex: number,
  name: string,
  id: string,
  mass: number
}

interface annotation {
  retentionIndex: number,
  intensity: number,
  replaced: boolean,
  mass: number
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: ResultTableItem[] = [
  {
    "target": {
      "retentionIndex": 702.9960327148438,
      "name": "1_CE(22:1) iSTD [2M+Na]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "id": "1_CE(22:1) iSTD [2M+Na]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "mass": 1436.3142
    },
    "annotation": {
      "retentionIndex": 702.7479190238587,
      "intensity": 128976.625,
      "replaced": false,
      "mass": 1436.3198331220735
    }
  },
  {
    "target": {
      "retentionIndex": 702.9960327148438,
      "name": "1_CE(22:1) iSTD [2M+NH4]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "id": "1_CE(22:1) iSTD [2M+NH4]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "mass": 1431.3588
    },
    "annotation": {
      "retentionIndex": 703.7776250005793,
      "intensity": 905498.875,
      "replaced": false,
      "mass": 1431.3615455123675
    }
  },
  {
    "target": {
      "retentionIndex": 702.9960327148438,
      "name": "1_CE(22:1) iSTD [M+Chol-head–H2O+H]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "id": "1_CE(22:1) iSTD [M+Chol-head–H2O+H]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "mass": 1076.0144
    },
    "annotation": {
      "retentionIndex": 703.2627353893716,
      "intensity": 137314.875,
      "replaced": false,
      "mass": 1076.0160223135392
    }
  },
  {
    "target": {
      "retentionIndex": 702.9960327148438,
      "name": "1_CE(22:1) iSTD [M+Na]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "id": "1_CE(22:1) iSTD [M+Na]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "mass": 729.652
    },
    "annotation": {
      "retentionIndex": 702.7479190238587,
      "intensity": 50644.51953125,
      "replaced": false,
      "mass": 729.6519725141561
    }
  },
  {
    "target": {
      "retentionIndex": 702.9960327148438,
      "name": "1_CE(22:1) iSTD [M+NH4]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "id": "1_CE(22:1) iSTD [M+NH4]+_SQHUGNAFKZZXOT-JWTURFAQSA-N",
      "mass": 724.6966
    },
    "annotation": {
      "retentionIndex": 703.7776250005793,
      "intensity": 390124.4375,
      "replaced": false,
      "mass": 724.6976839284096
    }
  },
  {
    "target": {
      "retentionIndex": 356.3160095214844,
      "name": "1_Cer(d18:1/17:0) iSTD [M+H]+_ICWGMOFDULMCFL-QKSCFGQVSA-N",
      "id": "1_Cer(d18:1/17:0) iSTD [M+H]+_ICWGMOFDULMCFL-QKSCFGQVSA-N",
      "mass": 552.535
    },
    "annotation": {
      "retentionIndex": 356.55133466154285,
      "intensity": 106293.90625,
      "replaced": false,
      "mass": 552.5352880363372
    }
  },
  {
    "target": {
      "retentionIndex": 356.3160095214844,
      "name": "1_Cer(d18:1/17:0) iSTD [M+H–H2O]+_ICWGMOFDULMCFL-QKSCFGQVSA-N",
      "id": "1_Cer(d18:1/17:0) iSTD [M+H–H2O]+_ICWGMOFDULMCFL-QKSCFGQVSA-N",
      "mass": 534.5245
    },
    "annotation": {
      "retentionIndex": 356.55133466154285,
      "intensity": 123223.703125,
      "replaced": false,
      "mass": 534.5248214450247
    }
  },
  {
    "target": {
      "retentionIndex": 356.3160095214844,
      "name": "1_Cer(d18:1/17:0) iSTD [M+Na]+_ICWGMOFDULMCFL-QKSCFGQVSA-N",
      "id": "1_Cer(d18:1/17:0) iSTD [M+Na]+_ICWGMOFDULMCFL-QKSCFGQVSA-N",
      "mass": 574.517
    },
    "annotation": {
      "retentionIndex": 357.52746555770375,
      "intensity": 304878.8125,
      "replaced": false,
      "mass": 574.5181781850264
    }
  },
  {
    "target": {
      "retentionIndex": 288.5639953613281,
      "name": "1_Cholesterol d7 iSTD [M–H2O+H]+_HVYWMOMLDIMFJA-IFAPJKRJSA-N",
      "id": "1_Cholesterol d7 iSTD [M–H2O+H]+_HVYWMOMLDIMFJA-IFAPJKRJSA-N",
      "mass": 376.3955
    },
    "annotation": {
      "retentionIndex": 288.6958787069904,
      "intensity": 20540.947265625,
      "replaced": false,
      "mass": 376.3949819554095
    }
  },
  {
    "target": {
      "retentionIndex": 46.71000289916992,
      "name": "1_CUDA iSTD [M+H]+_HPTJABJPZMULFH-UHFFFAOYSA-N",
      "id": "1_CUDA iSTD [M+H]+_HPTJABJPZMULFH-UHFFFAOYSA-N",
      "mass": 341.2799
    },
    "annotation": {
      "retentionIndex": 47.11568362743605,
      "intensity": 664181.9375,
      "replaced": false,
      "mass": 341.28072056468346
    }
  },
  {
    "target": {
      "retentionIndex": 255.70201110839844,
      "name": "1_DG(12:0/12:0/0:0) iSTD [M+K]+_OQQOAWVKVDAJOI-VWLOTQADSA-N",
      "id": "1_DG(12:0/12:0/0:0) iSTD [M+K]+_OQQOAWVKVDAJOI-VWLOTQADSA-N",
      "mass": 495.3446
    },
    "annotation": {
      "retentionIndex": 254.95597670745497,
      "intensity": 5050.83642578125,
      "replaced": false,
      "mass": 495.34516694194934
    }
  },
  {
    "target": {
      "retentionIndex": 255.70201110839844,
      "name": "1_DG(12:0/12:0/0:0) iSTD [M+Na]+_OQQOAWVKVDAJOI-VWLOTQADSA-N",
      "id": "1_DG(12:0/12:0/0:0) iSTD [M+Na]+_OQQOAWVKVDAJOI-VWLOTQADSA-N",
      "mass": 479.3707
    },
    "annotation": {
      "retentionIndex": 255.4454312977526,
      "intensity": 178882.5,
      "replaced": false,
      "mass": 479.3709504843706
    }
  },
  {
    "target": {
      "retentionIndex": 255.70201110839844,
      "name": "1_DG(12:0/12:0/0:0) iSTD [M+NH4]+_OQQOAWVKVDAJOI-VWLOTQADSA-N",
      "id": "1_DG(12:0/12:0/0:0) iSTD [M+NH4]+_OQQOAWVKVDAJOI-VWLOTQADSA-N",
      "mass": 474.4153
    },
    "annotation": {
      "retentionIndex": 255.93391094131948,
      "intensity": 21767.26953125,
      "replaced": false,
      "mass": 474.41483044639887
    }
  },
  {
    "target": {
      "retentionIndex": 190.42201232910156,
      "name": "1_DG(18:1/2:0/0:0) iSTD [M+K]+_PWTCCMJTPHCGMS-YRBAHSOBSA-N",
      "id": "1_DG(18:1/2:0/0:0) iSTD [M+K]+_PWTCCMJTPHCGMS-YRBAHSOBSA-N",
      "mass": 437.2664
    },
    "annotation": {
      "retentionIndex": 190.15182208192053,
      "intensity": 18738.66015625,
      "replaced": false,
      "mass": 437.26587301436376
    }
  },
  {
    "target": {
      "retentionIndex": 190.42201232910156,
      "name": "1_DG(18:1/2:0/0:0) iSTD [M+Na]+_PWTCCMJTPHCGMS-YRBAHSOBSA-N",
      "id": "1_DG(18:1/2:0/0:0) iSTD [M+Na]+_PWTCCMJTPHCGMS-YRBAHSOBSA-N",
      "mass": 421.2924
    },
    "annotation": {
      "retentionIndex": 190.15182208192053,
      "intensity": 910810.625,
      "replaced": false,
      "mass": 421.2928231538313
    }
  },
  {
    "target": {
      "retentionIndex": 190.42201232910156,
      "name": "1_DG(18:1/2:0/0:0) iSTD [M+NH4]+_PWTCCMJTPHCGMS-YRBAHSOBSA-N",
      "id": "1_DG(18:1/2:0/0:0) iSTD [M+NH4]+_PWTCCMJTPHCGMS-YRBAHSOBSA-N",
      "mass": 416.3371
    },
    "annotation": {
      "retentionIndex": 190.64442667249293,
      "intensity": 124655.265625,
      "replaced": false,
      "mass": 416.3371374379028
    }
  },
  {
    "target": {
      "retentionIndex": 111.15599822998047,
      "name": "1_LPC(17:0) iSTD [M+H]+_SRRQPVVYXBTRQK-XMMPIXPASA-N",
      "id": "1_LPC(17:0) iSTD [M+H]+_SRRQPVVYXBTRQK-XMMPIXPASA-N",
      "mass": 510.3554
    },
    "annotation": {
      "retentionIndex": 111.36943955472996,
      "intensity": 915958.8125,
      "replaced": false,
      "mass": 510.3562261724381
    }
  },
  {
    "target": {
      "retentionIndex": 81.03600311279297,
      "name": "1_LPE(17:1) iSTD [M+H]+_LNJNONCNASQZOB-HEDKFQSOSA-N",
      "id": "1_LPE(17:1) iSTD [M+H]+_LNJNONCNASQZOB-HEDKFQSOSA-N",
      "mass": 466.2928
    },
    "annotation": {
      "retentionIndex": 81.85867960961767,
      "intensity": 44049.91015625,
      "replaced": false,
      "mass": 466.292548477142
    }
  },
  {
    "target": {
      "retentionIndex": 182.3159942626953,
      "name": "1_MG(17:0/0:0/0:0) iSTD [M+H]+_SVUQHVRAGMNPLW-UHFFFAOYSA-N",
      "id": "1_MG(17:0/0:0/0:0) iSTD [M+H]+_SVUQHVRAGMNPLW-UHFFFAOYSA-N",
      "mass": 345.2999
    },
    "annotation": {
      "retentionIndex": 182.7581905001083,
      "intensity": 18397.759765625,
      "replaced": false,
      "mass": 345.300027841164
    }
  },
  {
    "target": {
      "retentionIndex": 182.3159942626953,
      "name": "1_MG(17:0/0:0/0:0) iSTD [M+Na]+_SVUQHVRAGMNPLW-UHFFFAOYSA-N",
      "id": "1_MG(17:0/0:0/0:0) iSTD [M+Na]+_SVUQHVRAGMNPLW-UHFFFAOYSA-N",
      "mass": 367.2819
    },
    "annotation": {
      "retentionIndex": 182.7581905001083,
      "intensity": 82196.5625,
      "replaced": false,
      "mass": 367.28180285352835
    }
  },
  {
    "target": {
      "retentionIndex": 211.1639862060547,
      "name": "1_PC(12:0/13:0) iSTD [M+H]+_FCTBVSCBBWKZML-WJOKGBTCSA-N",
      "id": "1_PC(12:0/13:0) iSTD [M+H]+_FCTBVSCBBWKZML-WJOKGBTCSA-N",
      "mass": 636.4599
    },
    "annotation": {
      "retentionIndex": 210.32648715192911,
      "intensity": 56498.10546875,
      "replaced": false,
      "mass": 636.4597242800644
    }
  },
  {
    "target": {
      "retentionIndex": 376.10400390625,
      "name": "1_PE(17:0/17:0) iSTD [M+H]+_YSFFAUPDXKTJMR-DIPNUNPCSA-N",
      "id": "1_PE(17:0/17:0) iSTD [M+H]+_YSFFAUPDXKTJMR-DIPNUNPCSA-N",
      "mass": 720.5538
    },
    "annotation": {
      "retentionIndex": 376.0783971006602,
      "intensity": 200455.3125,
      "replaced": false,
      "mass": 720.5556351488094
    }
  },
  {
    "target": {
      "retentionIndex": 303.822021484375,
      "name": "1_SM(d18:1/17:0) iSTD [M+H]+_YMQZQHIESOAPQH-JXGHDCMNSA-N",
      "id": "1_SM(d18:1/17:0) iSTD [M+H]+_YMQZQHIESOAPQH-JXGHDCMNSA-N",
      "mass": 717.5905
    },
    "annotation": {
      "retentionIndex": 303.3483077128463,
      "intensity": 254057.46875,
      "replaced": false,
      "mass": 717.5920645067762
    }
  },
  {
    "target": {
      "retentionIndex": 63.34199523925781,
      "name": "1_Sphingosine(d17:1) iSTD [M+H]+_RBEJCQPPFCKTRZ-LHMZYYNSSA-N",
      "id": "1_Sphingosine(d17:1) iSTD [M+H]+_RBEJCQPPFCKTRZ-LHMZYYNSSA-N",
      "mass": 286.2741
    },
    "annotation": {
      "retentionIndex": 62.254100225133904,
      "intensity": 47010.84375,
      "replaced": false,
      "mass": 286.27418731842283
    }
  },
  {
    "target": {
      "retentionIndex": 661.3200073242188,
      "name": "1_TG d5(17:0/17:1/17:0) iSTD [M+Na]+_OWYYELCHNALRQZ-ADIIQMQPSA-N",
      "id": "1_TG d5(17:0/17:1/17:0) iSTD [M+Na]+_OWYYELCHNALRQZ-ADIIQMQPSA-N",
      "mass": 874.7882
    },
    "annotation": {
      "retentionIndex": 660.2625655725421,
      "intensity": 258618,
      "replaced": false,
      "mass": 874.7905731368812
    }
  },
  {
    "target": {
      "retentionIndex": 661.3200073242188,
      "name": "1_TG d5(17:0/17:1/17:0) iSTD [M+NH4]+_OWYYELCHNALRQZ-ADIIQMQPSA-N",
      "id": "1_TG d5(17:0/17:1/17:0) iSTD [M+NH4]+_OWYYELCHNALRQZ-ADIIQMQPSA-N",
      "mass": 869.8329
    },
    "annotation": {
      "retentionIndex": 660.2625655725421,
      "intensity": 249577.3125,
      "replaced": false,
      "mass": 869.8348744256043
    }
  }
];

/**
 * Data source for the NgTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ResultTableDataSource extends DataSource<ResultTableItem> {
  data: ResultTableItem[] = EXAMPLE_DATA;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ResultTableItem[]> {
    return observableOf(this.data);
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}


  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  // private getSortedData(data: ResultTableItem[]) {

  //   return data.sort((a, b) => {
  //     const isAsc = this.sort.direction === 'asc';
  //     switch (this.sort.active) {
  //       case 'target.retentionIndex': return compare(a.target.retentionIndex, b.target.retentionIndex, isAsc);
  //       case 'target.name': return compare(a.target.name, b.target.name, isAsc);
  //       case 'target.mass': return compare(a.target.mass, b.target.mass, isAsc);
  //       case 'annotation.retentionIndex': return compare(a.annotation.retentionIndex, b.annotation.retentionIndex, isAsc);
  //       case 'annotation.intensity': return compare(a.annotation.intensity, b.annotation.intensity, isAsc);
  //       case 'annotation.replaced': return compare(a.annotation.replaced, b.annotation.replaced, isAsc);
  //       case 'annotation.mass': return compare(a.annotation.mass, b.annotation.mass, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
