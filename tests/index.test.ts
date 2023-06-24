import { Anonimizer, Features, IAnonimizer, RunValueMap } from "../src";

describe('Test Anomization and Rehydration', () => {
    test('When using the same input, Anonomisation then rehydrations should produce the exact same text.', () => {
        const anonimizer : IAnonimizer = new Anonimizer();
        
        const originalInput = "Write an email to Jim, asking them to email Philip at cfo@client.com to call Maria about getting that PO sorted. Also ask about the progress of the #Acquisition Deal.";
        console.log("input:", originalInput);

        const featuresToReplace = new Array(Features.People, Features.Emails, Features.Urls, Features.HashTags);
        let [safeText, runValueMap] = anonimizer.anonimize(originalInput, featuresToReplace);
        console.log("safeText:", safeText);

        expect(safeText != originalInput);

        let rehydratedText = anonimizer.reHydrate(safeText, runValueMap);
        console.log("rehydratedText:", rehydratedText);

        expect(safeText != rehydratedText);
        expect(originalInput == rehydratedText);
    });

    test('PromptResponse Rehydration post prompt anonimisation', () => {
        const anonimizer : IAnonimizer = new Anonimizer();
        
        const originalInput = "Write an email to Jim, asking them to email Philip at cfo@client.com to call Maria about getting that PO sorted. Also ask about the progress of the #Acquisition Deal.";
        console.log("input:", originalInput);

        const featuresToReplace = new Array(Features.People, Features.Emails, Features.Urls, Features.HashTags);
        let [safeText, runValueMap] = anonimizer.anonimize(originalInput, featuresToReplace);
        console.log("safeText:", safeText);

        expect(safeText != originalInput);

        const promptResponse = `Dear Ava,
        I hope this email finds you well. I have an important request on behalf of Charlotte from our team. Charlotte would greatly appreciate it if you could reach out to Benjamin at safeexample1@example.com and ask him to call her regarding the Purchase Order (PO) that needs to be sorted urgently.
        Additionally, Charlotte would like to inquire about the progress and any updates regarding the #Alligator Deal. She would like to stay informed and ensure everything is on track.
        Best Regards,`
        console.log("promptResponse:", promptResponse);

        let rehydratedText = anonimizer.reHydrate(promptResponse, runValueMap);
        console.log("rehydratedText:", rehydratedText);

        expect(rehydratedText === `Dear Jim,,
        I hope this email finds you well. I have an important request on behalf of Maria from our team. Maria would greatly appreciate it if you could reach out to Philip at cfo@client.com and ask him to call her regarding the Purchase Order (PO) that needs to be sorted urgently.     
        Additionally, Maria would like to inquire about the progress and any updates regarding the #Acquisition Deal. She would like to stay informed and ensure everything is on track.
        Best Regards,`);
    })
});
