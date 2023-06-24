# Anonimizer

A library used to replace sensitive information in text, and then later be able to rehydrate that information in derived text. This library works entirely in memory without interacting with any 3rd-party services.

The intended use case is to santize input for public AI Services, and then be able to replace the sanitized value in the AI Output with the AI Values.

## Example

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

* Create an instance of Anonimizer, and set your replacement options
``` ts
const anonimizer = new Anonimizer();
```

### Anonimize

* Pass the string to be sanitize
* Will return the sanitized version, and a map of what features/values where replaced.

``` ts
const opts = new ReplacementOptions();
opts.emails = opts.urls = opts.hashTags = true;
let [safeText, runValueMap] = anonimizer.anonimize(originalInput, opts);
```

### Rehydrate

* Pass the string to to have the values rehydrated, as well as the map used in the original anonimzation.
* Will return the text with sanitized values replaced with their original values.

``` ts
let rehydratedText = anonimizer.reHydrate(safeText, runValueMap);
```

## Build
* Install Dependencies
``` console
npm i
```
* Build
``` console
npm run build
```

## Accuracy

As this deals with text, and text parsing is always _twiggy_ - it's impossible to guarentee 100% safety and security. No guarentee or warranty, implied or otherwise are offered. The author(s) of this library take no responsibility for any loss that may results from usage of this library. Please always review data you store and send to 3rd party systems to ensure they comply with legal requirements for your jurisdiction, industry and obligations.