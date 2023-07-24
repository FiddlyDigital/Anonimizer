import nlp from "compromise/three";
import { featureTestCases } from './featureTestCases';
import { Anonimizer, Feature, IAnonimizer } from "../../../src";

let anonimizer: IAnonimizer;

beforeAll(() => {
    anonimizer = new Anonimizer();
});

describe('Anonimization/Rehydration of People', () => {
    test.each(featureTestCases)('Should correctly replace all people in phrase %p', (input) => {
        const [anonimisedInput, runValueMap] = anonimizer.anonimize(input, new Array(Feature.People));
        const rehydratedInput = anonimizer.reHydrate(anonimisedInput, runValueMap);

        const peopleInput = getPeopleInString(input);
        const peopleAnonimized = getPeopleInString(anonimisedInput);
        const peopleRehydrated = getPeopleInString(rehydratedInput);

        expect(peopleInput.length > 0);
        expect(peopleAnonimized.length > 0);
        expect(peopleRehydrated.length > 0);

        expect(peopleInput.length === peopleAnonimized.length);
        expect(peopleInput.length === peopleRehydrated.length);

        // PG: Note entirely sure if this is too much?
        expect(!peopleInput.some(person => peopleAnonimized.includes(person)));
        expect(!peopleRehydrated.some(person => peopleAnonimized.includes(person)));
    });
});

function getPeopleInString(input: string): string[] {
    return nlp(input).people().out('array');
}
