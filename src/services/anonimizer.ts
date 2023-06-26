import nlp from 'compromise';
import type Three from 'compromise/types/view/three';
import type Two from 'compromise/types/view/two';
import type { IAnonimizer } from './interfaces/IAnonimizer';
import { dataMap } from '../data';
import { Feature, RunValueMap } from '../models';

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

    public constructor (customFeatureDate?: Map<Feature, string[]>) {
        this.dataMap = dataMap;

        if (customFeatureDate !== undefined && customFeatureDate.size > 0) {
            customFeatureDate.forEach((value: string[], key: Feature) => {
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
        let output = input;
        const runMap = new RunValueMap(featuresToReplace);

        this.runOrder.forEach(feature => {
            if (featuresToReplace.includes(feature)) {
                const valueMap = runMap.Values.get(feature);
                const safeValues = this.dataMap.get(feature);

                if (valueMap !== undefined && safeValues !== undefined) {
                    const featureInstances: string[] = this.getNamedFeatureInstancesWithinText(output, feature);
                    output = this.anonimizationReplace(output, featureInstances, valueMap, safeValues);
                }
            }
        });

        return [output, runMap];
    }

    /**
     * Replaces previously anonimized data in a string with the original data
     * @param input The safe string to be reydrated
     * @param runMap The runMap from the original anonimization run
     * @returns A version of the input string that has all safe data replaced with the original data
     */
    public reHydrate (input: string, runMap: RunValueMap): string {
        let output = input;

        // PG: Important! Need to rehydrate in reverse order of anonymization
        this.runOrder.reverse().forEach(feature => {
            if (runMap.Features.includes(feature)) {
                const valueMap = runMap.Values.get(feature);
                if (valueMap !== undefined) {
                    const featureInstances: string[] = this.getNamedFeatureInstancesWithinText(output, feature);
                    output = this.hydrationReplace(output, featureInstances, valueMap);
                }
            }
        });

        return output;
    }

    private anonimizationReplace (input: string, featureInstances: string[], featureMapValues: Map<string, string>, safeValues: string[]): string {
        let output = input;

        featureInstances.filter(this.onlyUnique).forEach((instance: string, i: number) => {
            // lets replace all instances of the sensitive value with a safe one
            const sensitiveValueAsRegex = new RegExp(instance, 'g');
            output = output.replace(sensitiveValueAsRegex, safeValues[i]);
            featureMapValues.set(safeValues[i], instance);
        });

        return output;
    }

    private hydrationReplace (input: string, featureInstances: string[], featureMapValues: Map<string, string>): string {
        let output = input;

        featureInstances.filter(this.onlyUnique).forEach((instance: string, i: number) => {
            // Replace the Safe values (the instance in this case) with the originally entered value
            let instanceValue: string = instance.trim().replace(/[,]/, '');
            if (instanceValue.charAt(instanceValue.length - 1) === '.') {
                instanceValue = instanceValue.substring(0, instanceValue.length - 1);
            }

            // Only try and change back to the originally entered value, if we have one!
            const matchingValue = featureMapValues.get(instanceValue)
            if (matchingValue != null) {
                const matchingValueAsRegex = new RegExp(instanceValue, 'g');
                output = output.replace(matchingValueAsRegex, matchingValue);
            } else {
                console.log(`Couldn't rehydrate ${instanceValue}`);
            }
        });

        return output;
    }

    private onlyUnique (value: string, index: number, array: any[]): boolean {
        return array.indexOf(value) === index;
    }

    private getNamedFeatureInstancesWithinText (input: string, feature: Feature): string[] {
        const nlpParsedInput: Three = nlp(input);
        let featureNLP: Two | null = null;

        switch (feature) {
            case Feature.Acronyms:
                featureNLP = nlpParsedInput.acronyms();
                break;
            case Feature.Emails:
                featureNLP = nlpParsedInput.emails();
                break;
            case Feature.HashTags:
                featureNLP = nlpParsedInput.hashTags();
                break;
            case Feature.Organizations:
                featureNLP = nlpParsedInput.organizations();
                break;
            case Feature.People:
                featureNLP = nlpParsedInput.people();
                break;
            case Feature.Phonenumbers:
                featureNLP = nlpParsedInput.phoneNumbers();
                break;
            case Feature.Urls:
                featureNLP = nlpParsedInput.urls();
                break;
        }

        if (featureNLP != null) {
            return featureNLP.out('array');
        }

        return [];
    }
}
