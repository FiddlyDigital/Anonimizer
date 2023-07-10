import type { Feature, RunValueMap } from '../../models';

export interface IAnonimizer {
    /**
     * Anonimizes sensitive data
     * @param { string } input The input with potentially unsafe or sensitive data that to be anonimized
     * @param { Feature[] } featuresToReplace Flags representing what kinds of features of the text to replace
     * @returns { [string,RunValueMap] } A version of the input that has the required sensitive data replaced, as well as a map of what values got replaced / and their replacements
     */
    anonimize(input: string, featuresToReplace: Feature[]): [string, RunValueMap]
    /**
     * Replaces previously anonimized data in a string with the original data
     * @param { string } input The safe string to be reydrated
     * @param { RunValueMap } runMap The runMap from the original anonimization run
     * @returns { string } A version of the input string that has all 'safe' data replaced with the original sensitive values
     */
    reHydrate(input: string, runMap: RunValueMap): string
};
