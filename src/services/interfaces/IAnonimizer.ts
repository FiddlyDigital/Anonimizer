import type { Feature, RunValueMap } from '../../models';

export interface IAnonimizer {
    anonimize(input: string, featuresToReplace: Feature[]): [string, RunValueMap]
    reHydrate(input: string, runMap: RunValueMap): string
};
