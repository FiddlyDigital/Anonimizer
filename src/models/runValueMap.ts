import { Features } from "./features";

export class RunValueMap {
    public Features: Features[];
    public Values: Map<Features, Map<string, string>>;

    constructor (features: Features[]) {
        this.Features = features;
        this.Values = new Map<Features, Map<string, string>>();

        features.forEach(feature => {
            this.Values.set(feature, new Map<string, string>());
        });
    }
};
