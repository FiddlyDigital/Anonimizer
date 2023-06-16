import nlp from 'compromise';
import type Three from 'compromise/types/view/three';
import type Two from 'compromise/types/view/two';
import type { IAnonimizer } from './interfaces/IAnonimizer';
import { acronyms, emails, hashtags, organizations, people, phonenumbers, urls } from '../data';
import { Features, RunValueMap } from '../models';
import type { ReplacementOptions } from '../models';

/**
 * A class to both Anonimize and rehydrate previously anonimized data; and it's derivatives
 */
export class Anonimizer implements IAnonimizer {
    /**
     * Anonimizes sensitive data
     * @param input The input with potentially unsafe or sensitive data that to be anonimized
     * @param opts Flags representing what kinds of features of the text to replace
     * @returns A version of the input that has the required sensitive data replaced, as well as a map of what values got replaced / and their replacements
     */
    public anonimize (input: string, opts: ReplacementOptions): [string, RunValueMap] {
        let output = input;
        const runMap = new RunValueMap(opts);

        if (opts.people) { output = this.anonimizationReplace(output, Features.People, runMap.people, people); }
        if (opts.organizations) { output = this.anonimizationReplace(output, Features.Organizations, runMap.organizations, organizations); }
        if (opts.phonenumbers) { output = this.anonimizationReplace(output, Features.Phonenumbers, runMap.phonenumbers, phonenumbers); }
        if (opts.hashTags) { output = this.anonimizationReplace(output, Features.HashTags, runMap.hashTags, hashtags); }
        if (opts.emails) { output = this.anonimizationReplace(output, Features.Emails, runMap.emails, emails); }
        if (opts.urls) { output = this.anonimizationReplace(output, Features.Urls, runMap.urls, urls); }
        if (opts.acronyms) { output = this.anonimizationReplace(output, Features.Acronyms, runMap.acronyms, acronyms); }

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
        if (runMap.opts.acronyms) { output = this.hydrationReplace(output, Features.Acronyms, runMap.acronyms); }
        if (runMap.opts.urls) { output = this.hydrationReplace(output, Features.Urls, runMap.urls); }
        if (runMap.opts.emails) { output = this.hydrationReplace(output, Features.Emails, runMap.emails); }
        if (runMap.opts.hashTags) { output = this.hydrationReplace(output, Features.HashTags, runMap.hashTags); }
        if (runMap.opts.phonenumbers) { output = this.hydrationReplace(output, Features.Phonenumbers, runMap.phonenumbers); }
        if (runMap.opts.organizations) { output = this.hydrationReplace(output, Features.Organizations, runMap.organizations); }
        if (runMap.opts.people) { output = this.hydrationReplace(output, Features.People, runMap.people); }

        return output;
    }

    private anonimizationReplace (input: string, feature: string, featureMapValues: Map<string, string>, safeValues: string[]): string {
        let output = input;
        const featureInstances: string[] = this.getNamesFeatureInstancesWithinText(output, feature);

        featureInstances.filter(this.onlyUnique).forEach((instance: string, i: number) => {
            // lets replace all instances of the sensitive value with a safe one
            const sensitiveValueAsRegex = new RegExp(instance, 'g');
            output = output.replace(sensitiveValueAsRegex, safeValues[i]);
            featureMapValues.set(safeValues[i], instance);
        });

        return output;
    }

    private hydrationReplace (input: string, feature: string, featureMapValues: Map<string, string>): string {
        let output = input;
        const featureInstances: string[] = this.getNamesFeatureInstancesWithinText(output, feature);

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

    private getNamesFeatureInstancesWithinText (input: string, feature: string): string[] {
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
