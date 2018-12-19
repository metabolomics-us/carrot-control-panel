export class Library {
    method: string;
    instrument: string;
    column: string;
    ionMode: IonMode;

    constructor(value: string) {
        let tokens = value.split(RegExp('\\s\\|\\s'))

        this.method = tokens[0];
        this.instrument = tokens[1];
        this.column = tokens[2];
        this.ionMode = tokens[3] == 'negative'? IonMode.NEGATIVE : IonMode.POSITIVE;
    }

    toString() {
        return `${this.method} | ${this.instrument} | ${this.column} | ${this.ionMode}`;
    }
}

export enum IonMode {
    POSITIVE='positive',
    NEGATIVE='negative'
}