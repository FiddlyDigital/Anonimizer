import { Feature } from '../../../src/models/feature';
import { FeatureHelper } from '../../../src/services/featureHelper';

describe('FeatureHelper', () => {
    describe('GetFeatureInstances', () => {

        test('should throw when input is invalid', () => {
            // Define input and feature
            const input = '';
            const feature = Feature.Acronyms;

            expect(() => {
                FeatureHelper.GetFeatureInstances(input, feature);
            }).toThrow(Error);
        });

        test('should throw when feature is invalid', () => {
            // Define input and feature
            const input = 'Some input text';
            const feature = '' as Feature;

            expect(() => {
                FeatureHelper.GetFeatureInstances(input, feature);
            }).toThrow(Error);
        });

        test('should return an empty array when no instances found', () => {
            // Define input and feature
            const input = 'Some input text';
            const feature = Feature.Acronyms;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual([]);
        });

        test('should return an empty array for unknown features', () => {
            // Define input and an unknown feature
            const input = 'Some input text';
            const feature = 'UnknownFeature' as Feature;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual([]);
        });

        test('should return correct instances for People', () => {
            // Define input and feature
            const input = 'John, Mary may go shopping today.';
            const feature = Feature.People;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual(['John', 'Mary']);
        });

        test('should return correct instances for Emails feature', () => {
            // Define input and feature
            const input = 'Please contact john.doe@example.com or jane.smith@example.com';
            const feature = Feature.Emails;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual(['john.doe@example.com', 'jane.smith@example.com']);
        });

        test('should return correct instances for HashTags feature', () => {
            // Define input and feature
            const input = 'I love #testing and #automation';
            const feature = Feature.HashTags;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual(['#testing', '#automation']);
        });

        test('should return correct instances for Organizations feature', () => {
            // Define input and feature
            const input = 'Facebook is collaborating with Google';
            const feature = Feature.Organizations;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual(['Facebook', 'Google']);
        });

        test('should return correct instances for Phonenumbers feature', () => {
            // Define input and feature
            const input = 'Contact us at 123-456-7890 or 987-654-3210';
            const feature = Feature.Phonenumbers;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual(['123-456-7890', '987-654-3210']);
        });

        test('should return correct instances for Urls feature', () => {
            // Define input and feature
            const input = 'Check out https://www.example.com or http://www.test.com';
            const feature = Feature.Urls;

            // Call the method under test
            const result = FeatureHelper.GetFeatureInstances(input, feature);

            // Assert the result
            expect(result).toEqual(['https://www.example.com', 'http://www.test.com']);
        });
    });
});