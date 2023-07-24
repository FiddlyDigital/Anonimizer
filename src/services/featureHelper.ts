/* eslint-disable @typescript-eslint/no-extraneous-class */
import nlp from 'compromise';
import type Three from 'compromise/types/view/three';
import type Two from 'compromise/types/view/two';
import { ErrorMessages, RegexPatterns } from '../constants';
import { Feature } from '../models';

/**
 * Helper to extract feature instances from text
 */
// TODO: Better name for this class
export class FeatureHelper {
    private static readonly rgxPunctuation: RegExp = new RegExp(RegexPatterns.Punctuation, 'g')
    private static readonly rgxUppercaseChars: RegExp = new RegExp(RegexPatterns.UppercaseChars, 'g');

    /**
     * Will extract a instances of a feature from a given string
     * @param { string } input The string to parse
     * @param { Feature } feature The Feature to look for in the input string
     * @returns { string[] } An array with all instances of a named feature from a string
     */
    public static GetFeatureInstances (input: string, feature: Feature): string[] {
        if (input === undefined ||
            input.length === 0) {
            throw new Error(`FeatureHelper.GetFeatureInstances - ${ErrorMessages.InputNullOrEmpty}`);
        }

        if (feature === undefined ||
            feature.length === 0) {
            throw new Error(`FeatureHelper.GetFeatureInstances - ${ErrorMessages.FeatureNullOrEmpty}`);
        }

        let result: string[] = [];

        const nlpParsedInput: Three = nlp(input);
        if (nlpParsedInput === undefined) {
            throw new Error(`${ErrorMessages.CompromiseCantParse}`);
        }

        switch (feature) {
            case Feature.Acronyms:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.acronyms());
                break;
            case Feature.Emails:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.emails());
                break;
            case Feature.HashTags:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.hashTags());
                break;
            case Feature.Organizations:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.organizations());
                break;
            case Feature.People:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.people())
                    .filter((person) => {
                        // Only return true for names that begin with capital letters. While not ideal;
                        // this helps avoid false-positives like 'mark', which are also verbs, or say month names
                        return this.rgxUppercaseChars.test(person.charAt(0));
                    });
                result = this.CheckForSplitsAndCorrect(result);
                break;
            case Feature.Phonenumbers:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.phoneNumbers());
                break;
            case Feature.Urls:
                result = this.ExtractFeatureValuesFromNLP(nlpParsedInput.urls());
                break;
            default:
                // No action taken
                break;
        }

        return FeatureHelper.CleanUpValues(result)
    }

    private static CleanUpValues (featureInstances: string[]): string[] {
        return featureInstances.map((featureInstance) => {
            featureInstance = featureInstance.trim();

            // If the last character is punctuation, remove it.
            // TODO: loop here, as there may be multiple ending punctuation:
            // ... or !! or ???, etc.
            if (this.rgxPunctuation.test(featureInstance.charAt(-1))) {
                return featureInstance.substring(0, featureInstance.length - 2);
            }

            return featureInstance;
        })
    }

    private static CheckForSplitsAndCorrect (featureInstances: string[]): string[] {
        let index = 0;

        while (index < featureInstances.length) {
            // If there's a comma, split at the comma and add to the array.
            // then remove the value with the comma
            if (featureInstances[index].indexOf(',') > 0) {
                const splitValues = featureInstances[index].split(',');

                splitValues.forEach(splitValue => {
                    featureInstances.push(splitValue.trim());
                });

                featureInstances.splice(index, 1);
                continue;
            }

            index++;
        }

        return featureInstances;
    }

    private static ExtractFeatureValuesFromNLP (featureNLP: Two | null): string[] {
        if (featureNLP === undefined ||
            featureNLP === null) {
            return [];
        }

        return featureNLP.out('array');
    }
}
