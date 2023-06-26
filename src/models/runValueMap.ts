import type { Feature } from './feature';

export class RunValueMap {
    public Features: Feature[];
    public Values: Map<Feature, Map<string, string>>;

    constructor (features: Feature[]) {
        this.Features = features;
        this.Values = new Map<Feature, Map<string, string>>();

        features.forEach(feature => {
            this.Values.set(feature, new Map<string, string>());
        });
    }
};
