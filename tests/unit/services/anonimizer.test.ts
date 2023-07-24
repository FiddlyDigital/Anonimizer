import { Feature, IAnonimizer, Anonimizer, RunValueMap } from '../../../src/';

let anonimizer: IAnonimizer;

beforeAll(() => {
    anonimizer = new Anonimizer();
});

describe('Anonimizer', () => {
    describe('anonimize', () => {
        test('should throw when input is invalid', () => {
            const input = '';
            const featuresToReplace = new Array(Feature.People);

            expect(() => {
                anonimizer.anonimize(input, featuresToReplace);
            }).toThrow(Error);
        });

        test('should throw when FeatureToReplace is invalid', () => {
            const input = 'Some input text';
            const featuresToReplace = new Array();

            expect(() => {
                anonimizer.anonimize(input, featuresToReplace);
            }).toThrow(Error);
        });
    });

    describe('rehydrate', () => {
        test('should throw when input is invalid', () => {
            const input = '';
            const runMap = new RunValueMap(new Array(Feature.People));

            expect(() => {
                anonimizer.reHydrate(input, runMap);
            }).toThrow(Error);
        });

        test('should throw when runMap is invalid', () => {
            const input = 'Some input text';
            const runMap = new RunValueMap(new Array());

            expect(() => {
                anonimizer.reHydrate(input, runMap);
            }).toThrow(Error);
        });
    });
});
