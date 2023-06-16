import type { ReplacementOptions, RunValueMap } from '../../models';

export interface IAnonimizer {
    anonimize(input: string, opts: ReplacementOptions): [string, RunValueMap]
    reHydrate(input: string, runMap: RunValueMap): string
};
