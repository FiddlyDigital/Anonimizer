import { Anonimizer, Feature, IAnonimizer } from "../src";
let anonimizer: IAnonimizer;

beforeAll(() => {
    anonimizer = new Anonimizer();
});

describe('Anonimize', () => {
    test('InvalidInput_ShouldThrow', () => {
        expect(() => {
            anonimizer.anonimize('', new Array(Feature.People));
        }).toThrow(Error);
    });

    test('InvalidFeaturesToReplace_ShouldThrow', () => {
        expect(() => {
            anonimizer.anonimize('Philip testing.', new Array());
        }).toThrow(Error);
    });
})
