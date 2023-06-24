import { Anonimizer, Features } from "../src";

describe('testing index file', () => {
    test('When using the same input, Anonomisation then rehydrations should produce the exact same text.', () => {
        const anonimizer = new Anonimizer();
        
        const originalInput = "Email Jim at big@executive.com and tell them to call Brian at 555-123-456 #yolo ! Also tell Jim that Meg needs to talk to them.";
        console.log("input:", originalInput);

        const featuresToReplace = new Array(Features.People, Features.Emails, Features.Urls, Features.HashTags);
        let [safeText, valueMap] = anonimizer.anonimize(originalInput, featuresToReplace);
        console.log("safeText:", safeText);

        expect(safeText != originalInput);

        let rehydratedText = anonimizer.reHydrate(safeText, valueMap);
        console.log("rehydratedText:", rehydratedText);

        expect(safeText != rehydratedText);
        expect(originalInput == rehydratedText);
    });
});
