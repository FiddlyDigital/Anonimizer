import { Feature } from '../../../../src/models/feature';
import { FeatureHelper } from '../../../../src/services/featureHelper';
import { peopleTests, emailTests, hashtagTests, organizationTests, phoneNumberTests, urlTests } from './testdata';

describe('FeatureHelper', () => {
    describe('GetFeatureInstances', () => {
        describe('Argument Tests', () => {
            test('should throw when input is invalid', () => {
                const input = '';
                const feature = Feature.Acronyms;

                expect(() => {
                    FeatureHelper.GetFeatureInstances(input, feature);
                }).toThrow(Error);
            });

            test('should throw when feature is invalid', () => {
                const input = 'Some input text';
                const feature = '' as Feature;

                expect(() => {
                    FeatureHelper.GetFeatureInstances(input, feature);
                }).toThrow(Error);
            });

            test('should return an empty array when no instances found', () => {
                const input = 'Some input text';
                const feature = Feature.Acronyms;

                const result = FeatureHelper.GetFeatureInstances(input, feature);

                expect(result).toEqual([]);
            });

            test('should return an empty array for unknown features', () => {
                const input = 'Some input text';
                const feature = 'UnknownFeature' as Feature;

                const result = FeatureHelper.GetFeatureInstances(input, feature);

                expect(result).toEqual([]);
            });
        });

        describe('Feature Detection', () => {
            test.each(peopleTests) ('should find all instances of People in phrase %p', (testPhraseAndFeatureInstances) => {
                const result = FeatureHelper.GetFeatureInstances(testPhraseAndFeatureInstances.testPhrase, Feature.People);
                expect(result).toEqual(testPhraseAndFeatureInstances.featureInstances);
            });

            test.each(emailTests) ('should find all instances of Emails in phrase %p', (testPhraseAndFeatureInstances) => {
                const result = FeatureHelper.GetFeatureInstances(testPhraseAndFeatureInstances.testPhrase, Feature.Emails);
                expect(result).toEqual(testPhraseAndFeatureInstances.featureInstances);
            });

            test.each(hashtagTests) ('should find all instances of Hashtags in phrase %p', (testPhraseAndFeatureInstances) => {
                const result = FeatureHelper.GetFeatureInstances(testPhraseAndFeatureInstances.testPhrase, Feature.HashTags);
                expect(result).toEqual(testPhraseAndFeatureInstances.featureInstances);
            });

            test.each(organizationTests) ('should find all instances of Organizations in phrase %p', (testPhraseAndFeatureInstances) => {
                const result = FeatureHelper.GetFeatureInstances(testPhraseAndFeatureInstances.testPhrase, Feature.Organizations);
                expect(result).toEqual(testPhraseAndFeatureInstances.featureInstances);
            });

            test.each(phoneNumberTests) ('should find all instances of Phone Numbers in phrase %p', (testPhraseAndFeatureInstances) => {
                const result = FeatureHelper.GetFeatureInstances(testPhraseAndFeatureInstances.testPhrase, Feature.Phonenumbers);
                expect(result).toEqual(testPhraseAndFeatureInstances.featureInstances);
            });

            test.each(urlTests) ('should find all instances of URLs in phrase %p', (testPhraseAndFeatureInstances) => {
                const result = FeatureHelper.GetFeatureInstances(testPhraseAndFeatureInstances.testPhrase, Feature.Urls);
                expect(result).toEqual(testPhraseAndFeatureInstances.featureInstances);
            });
        });
    });
});