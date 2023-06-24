import nlp from 'compromise';
import type Three from 'compromise/types/view/three';
import type Two from 'compromise/types/view/two';
import type { IAnonimizer } from './interfaces/IAnonimizer';
import { dataMap } from '../data';
import { Features, RunValueMap } from '../models';

/**
 * A class to both anonimize and rehydrate previously anonimized data; and it's derivatives
 */
export class Anonimizer implements IAnonimizer {
    // PG: This is the anonimization order. Remember when rehydrating to run in the REVERSE order!
    private runOrder : Features[] = [
        Features.People,
        Features.Organizations,
        Features.Phonenumbers,
        Features.HashTags,
        Features.Emails,
        Features.Urls,
        Features.Acronyms
    ];

    /**
     * Anonimizes sensitive data
     * @param input The input with potentially unsafe or sensitive data that to be anonimized
     * @param opts Flags representing what kinds of features of the text to replace
     * @returns A version of the input that has the required sensitive data replaced, as well as a map of what values got replaced / and their replacements
     */
    public anonimize (input: string, featuresToReplace : Features[]): [string, RunValueMap] {
        let output = input;
        const runMap = new RunValueMap(featuresToReplace);

        this.runOrder.forEach(feature => {
            if (featuresToReplace.indexOf(feature) > -1) { 
                let valueMap = runMap.Values.get(feature);
                let safeValues = dataMap.get(feature);

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
            if (runMap.Features.indexOf(feature) > -1) { 
                let valueMap = runMap.Values.get(feature);
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

    private getNamedFeatureInstancesWithinText (input: string, feature: Features): string[] {
        const nlpParsedInput: Three = nlp(input);
        let featureNLP: Two | null = null;

        switch (feature) {
            case Features.Acronyms:
                featureNLP = nlpParsedInput.acronyms();
                break;
            case Features.Emails:
                featureNLP = nlpParsedInput.emails();
                break;
            case Features.HashTags:
                featureNLP = nlpParsedInput.hashTags();
                break;
            case Features.Organizations:
                featureNLP = nlpParsedInput.organizations();
                break;
            case Features.People:
                featureNLP = nlpParsedInput.people();
                break;
            case Features.Phonenumbers:
                featureNLP = nlpParsedInput.phoneNumbers();
                break;
            case Features.Urls:
                featureNLP = nlpParsedInput.urls();
                break;
        }

        if (featureNLP != null) {
            return featureNLP.out('array');
        }

        return [];
    }
}
