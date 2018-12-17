import { LastKey } from "./experiment.lastkey.model";
import { ExperimentItem } from "./experiment.item.model";

export class ExperimentPage {
    items: Array<ExperimentItem>;
    last_item: LastKey;
}
