import { Anonimizer, Feature, IAnonimizer, RunValueMap } from "../../src";
let anonimizer: IAnonimizer;

beforeAll(() => {
    anonimizer = new Anonimizer();
});

describe('Rehydrate', () => {
    test('InvalidInput_ShouldThrow', () => {
        expect(() => {
            anonimizer.reHydrate('', new RunValueMap(new Array(Feature.People)));
        }).toThrow(Error);
    });

    test('InvalidRunMap_ShouldThrow', () => {
        expect(() => {
            anonimizer.reHydrate('Philip testing.', new RunValueMap(new Array()));
        }).toThrow(Error);
    });
});
