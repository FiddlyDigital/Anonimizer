import type { Features, RunValueMap } from '../../models';

export interface IAnonimizer {
    anonimize(input: string, featuresToReplace : Features[]): [string, RunValueMap]
    reHydrate(input: string, runMap: RunValueMap): string
};
