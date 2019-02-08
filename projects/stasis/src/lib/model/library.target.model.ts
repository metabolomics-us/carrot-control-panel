import { Acquisition } from "./sample.acquisition.model";

export class LibraryTarget {
    mz_rt: string;
    method: string;

    constructor(public name: string, 
                method: Acquisition, 
                public mz: number, 
                public rt: number, 
                public riMarker: boolean = false, 
                public rtUnit: string = 'minutes', 
                public sample: string = 'User Defined' ) {
        this.name = name;
        this.method = method.toString();
        this.mz = mz;
        this.rt = rtUnit === 'seconds' ? rt/60 : rt;
        this.mz_rt = `${this.mz}_${this.rt}`;
        this.rtUnit = 'minutes';
        this.sample = sample;
    }
}