import { Anonimizer, ReplacementOptions } from "../src";

describe('testing index file', () => {
    test('When using the same input, Anonomisation then rehydrations should produce the exact same text.', () => {
        const anonimizer = new Anonimizer();
        const opts = new ReplacementOptions();
        opts.emails = opts.urls = opts.hashTags = true;
        
        const originalInput = "Email Jim at big@executive.com and tell him to call Brian at 555-123-456 #yolo";
        console.log("input:", originalInput);

        let [safeText, valueMap] = anonimizer.anonimize(originalInput, opts);
        console.log("safeText:", safeText);

        expect(safeText != originalInput);

        let rehydratedText = anonimizer.reHydrate(safeText, valueMap);
        console.log("rehydratedText:", rehydratedText);

        expect(safeText != rehydratedText);
        expect(originalInput == rehydratedText);
    });
});