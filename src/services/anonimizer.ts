import type { IAnonimizer } from './interfaces/IAnonimizer';
import { dataMap } from '../data';
import { Feature, RunValueMap } from '../models';
import { ErrorMessages } from '../constants';
import { FeatureHelper } from './featureHelper';

/**
 * A class to both anonimize and rehydrate previously anonimized data; and it's derivatives
 */
export class Anonimizer implements IAnonimizer {
    private readonly dataMap: Map<Feature, string[]>;

    // PG: This is the anonimization order. Remember when rehydrating to run in the REVERSE order!
    private readonly runOrder: Feature[] = [
        Feature.People,
        Feature.Organizations,
        Feature.Phonenumbers,
        Feature.HashTags,
        Feature.Emails,
        Feature.Urls,
        Feature.Acronyms
    ];

    /**
     * CTor for Anonimizer
     * @param customFeatureData? Optional Map to change the default safe data for given features to custom data
     */
    public constructor (customFeatureData?: Map<Feature, string[]>) {
        this.dataMap = dataMap;

        if (customFeatureData !== undefined &&
            customFeatureData.size > 0) {
            customFeatureData.forEach((value: string[], key: Feature) => {
                this.dataMap.set(key, value);
            })
        }
    }

    /**
     * Anonimizes sensitive data
     * @param input The input with potentially unsafe or sensitive data that to be anonimized
     * @param opts Flags representing what kinds of features of the text to replace
     * @returns A version of the input that has the required sensitive data replaced, as well as a map of what values got replaced / and their replacements
     */
    public anonimize (input: string, featuresToReplace: Feature[]): [string, RunValueMap] {
        if (input === undefined ||
            input.length === 0) {
            throw new Error(`anonimizer.anonimize - ${ErrorMessages.InputNullOrEmpty}`);
        }

        if (featuresToReplace === undefined ||
            featuresToReplace.length === 0) {
            throw new Error(`anonimizer.anonimize - ${ErrorMessages.FeaturesToReplaceNullOrEmpty}`);
        }

        let output = input;
        const runMap = new RunValueMap(featuresToReplace);

        for (const feature of this.runOrder) {
            if (!featuresToReplace.includes(feature)) {
                continue;
            }

            const valueMap = runMap.Values.get(feature);
            const safeValues = this.dataMap.get(feature);

            if (valueMap === undefined ||
                safeValues === undefined) {
                continue;
            }

            const featureInstances: string[] = FeatureHelper.GetFeatureInstances(output, feature);
            if (featureInstances.length === 0) {
                continue;
            }

            output = this.anonimizationReplace(output, featureInstances, valueMap, safeValues);
        }

        return [output, runMap];
    }

    /**
     * Replaces previously anonimized data in a string with the original data
     * @param input The safe string to be reydrated
     * @param runMap The runMap from the original anonimization run
     * @returns A version of the input string that has all 'safe' data replaced with the original sensitive values
     */
    public reHydrate (input: string, runMap: RunValueMap): string {
        if (input === undefined ||
            input.length === 0) {
            throw new Error(`anonimizer.reHydrate - ${ErrorMessages.InputNullOrEmpty}`);
        }

        if (runMap === undefined ||
            runMap === null ||
            runMap.Features === undefined ||
            runMap.Features === null ||
            runMap.Features.length === 0) {
            throw new Error(`anonimizer.reHydrate - ${ErrorMessages.RunMapNullOrEmpty}`);
        }

        let output = input;

        // PG: Important! Need to rehydrate in reverse order of anonymization
        for (const feature of this.runOrder.reverse()) {
            if (!runMap.Features.includes(feature)) {
                continue;
            }

            const valueMap = runMap.Values.get(feature);
            if (valueMap === undefined) {
                continue;
            }

            const featureInstances: string[] = FeatureHelper.GetFeatureInstances(output, feature);
            if (featureInstances.length === 0) {
                continue;
            }

            output = this.hydrationReplace(output, featureInstances, valueMap);
        }

        return output;
    }

    private anonimizationReplace (input: string, featureInstances: string[], featureMapValues: Map<string, string>, safeValues: string[]): string {
        let output = input;

        featureInstances.filter(this.onlyUnique).forEach((instance: string, i: number) => {
            // Lets replace all instances of the sensitive value with a safe one
            const sensitiveValueAsRegex = new RegExp(instance, 'g');
            output = output.replace(sensitiveValueAsRegex, safeValues[i]);
            featureMapValues.set(safeValues[i], instance);
        });

        return output;
    }

    private hydrationReplace (input: string, featureInstances: string[], featureMapValues: Map<string, string>): string {
        let output = input;

        for (const instance of featureInstances.filter(this.onlyUnique)) {
            // Replace the Safe values (the instance in this case) with the originally entered value
            // However, only try and change back to the originally entered value - if we have one!
            const matchingValue = featureMapValues.get(instance)
            if (matchingValue === undefined) {
                console.log(`${ErrorMessages.CouldntRehydrate} ${instance}`);
                continue;
            }

            const matchingValueAsRegex = new RegExp(instance, 'g');
            output = output.replace(matchingValueAsRegex, matchingValue);
        }

        return output;
    }

    private onlyUnique (value: string, index: number, array: any[]): boolean {
        return array.indexOf(value) === index;
    }
}
