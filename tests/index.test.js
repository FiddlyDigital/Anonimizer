import { Anonimizer, ReplacementOptions } from "../src";
describe('testing index file', function () {
    test('When using the same input, Anonomisation then rehydrations should produce the exact same text.', function () {
        var anonimizer = new Anonimizer();
        var opts = new ReplacementOptions();
        opts.emails = opts.urls = opts.hashTags = true;
        var originalInput = "Email Jim at big@executive.com and tell him to call Brian at 555-123-456 #yolo";
        console.log("input:", originalInput);
        var _a = anonimizer.anonimize(originalInput, opts), safeText = _a[0], valueMap = _a[1];
        console.log("safeText:", safeText);
        expect(safeText != originalInput);
        var rehydratedText = anonimizer.reHydrate(safeText, valueMap);
        console.log("rehydratedText:", rehydratedText);
        expect(safeText != rehydratedText);
        expect(originalInput == rehydratedText);
    });
});
