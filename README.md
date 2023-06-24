# Anonimizer

A library used to replace sensitive information in text, and then later to rehydrate that information in derived text. This library works entirely in memory without interacting with any 3rd-party services.

The intended usecase is to santize input that will be passes to public 3rd-party Services, and then be able to replace the sanitized value in the output with the original safe values. A prime example of this would be creating prompts to send to ChatGPT (or similiar).

## Example Usecase

Original Prompt:

> Write an email to Jim, asking them to email Philip at cfo@client.com to call Maria about getting that PO sorted. Also ask about the progress of the #Acquisition Deal.

Sanitized Prompt (via Anonomize method) safe to send to 3rd/party Service:

> Write an email to Ava asking them to email Benjamin at safeexample1@example.com to call Charlotte about getting that PO sorted. Also ask about the progress of the #Alligator Deal.

Response from 3rd-party Service:

> Dear Ava,
> I hope this email finds you well. I have an important request on behalf of Charlotte from our team. Charlotte would greatly appreciate it if you could reach out to Benjamin at safeexample1@example.com and ask him to call her regarding the Purchase Order (PO) that needs to be sorted urgently.
> Additionally, Charlotte would like to inquire about the progress and any updates regarding the #Alligator Deal. She would like to stay informed and ensure everything is on track.
> Best Regards,

Response Rehydrated, with original context and values restored:

> Dear Jim, 
> I hope this email finds you well. I have an important request on behalf of Maria from our team. Maria would greatly appreciate it if you could reach out to Philip at cfo@client.com and ask him to call her regarding the Purchase Order (PO) that needs to be sorted urgently.
>Additionally, Maria would like to inquire about the progress and any updates regarding the #Acquisition Deal. She would like to stay informed and ensure everything is on track.
> Best Regards,

## Usage

``` ts
// Create instance
const anonimizer : IAnonimizer = new Anonimizer();

/**
 * Anonimize
 * Pass the string to be sanitize, along as the list of features to be replaced.
 * Will return the sanitized version, and a map of what features/values were replaced.
 */
const featuresToReplace = new Array(Features.People, Features.Emails, Features.Urls, Features.HashTags);
let [safeText, runValueMap] = anonimizer.anonimize(originalInput, featuresToReplace);

/**
 * Rehydrate
 * Pass the string to to have the values rehydrated, as well as the map used in the original anonimzation.
 * Will return the text with sanitized values replaced with their original values.
 */
let rehydratedText = anonimizer.reHydrate(safeText, runValueMap);
```

### Build
``` console
npm i
npm run build
```

### Test
``` console
npm run test
```

## Warning

It's impossible to guarentee 100% safety and security when dealing with text replacing. No guarentee or warranty, implied or otherwise are offered. The author(s) of this library take no responsibility or nor accept andy liability for any loss that may result from usage of this library. Please always review the data you store and send to 3rd party systems, to ensure the transit ans storage complies with the legal requirements for your jurisdiction, industry and business obligations.