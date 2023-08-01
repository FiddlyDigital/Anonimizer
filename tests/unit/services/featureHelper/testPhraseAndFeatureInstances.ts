class TestPhraseAndFeatureInstances {
    testPhrase: string;
    featureInstances: string[];

    constructor(phrase: string, instances: string[]) {
        this.testPhrase = phrase;
        this.featureInstances = instances;
    }

    public toString(): string {
        return `${this.testPhrase} [${this.featureInstances.join(',')}]`
    }
}

export { TestPhraseAndFeatureInstances }