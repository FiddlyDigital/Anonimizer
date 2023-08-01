<a name="readme-top"></a>

<div align="center">
  <h1 align="center">Anonimizer</h1>

  <p align="center">
    A js library used to replace sensitive information in text, and then later to rehydrate that information in derived text.<br />This library works entirely in memory without interacting with any 3rd-party services.
    <br />
    <a href="https://fiddlydigital.github.io/Anonimizer/"><strong>Developer Docs »</strong></a>
    <br />
    <br />
    <a href="https://www.npmjs.com/package/@speakingsoftware/anonimizer">View on NPM</a>
    ·
    <a href="https://github.com/FiddlyDigital/Anonimizer/issues">Report Bug or Request a Feature</a>
  </p>
</div>

## Description

The intended use is to sanitize input that will be passed to public 3rd-party Services, and then be able to replace the sanitized value in the output with the original safe values. A prime example of this would be creating prompts to send to ChatGPT (or similiar). See Use Case Example below.

## Usage 
### Example
``` js
// Import via ESM
import { Anonimizer } from '@speakingsoftware/anonimizer'
// or Require via CJS
// const Anonimizer = require('@speakingsoftware/anonimizer').Anonimizer

// Create instance
const anonimizer = new Anonimizer();

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
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Example Usecase

Original Prompt:

> Write an email to Jim, asking them to email Philip at cfo@client.com to call Maria about getting that PO sorted. Also ask about the progress of the #Acquisition Deal.

Sanitized Prompt (via `anonomize` method) safe to send to 3rd/party Service:

> Write an email to Ava asking them to email Benjamin at safeexample1@example.com to call Charlotte about getting that PO sorted. Also ask about the progress of the #Alligator Deal.

Response from 3rd-party Service:

> Dear Ava,
> I hope this email finds you well. I have an important request on behalf of Charlotte from our team. Charlotte would greatly appreciate it if you could reach out to Benjamin at safeexample1@example.com and ask him to call her regarding the Purchase Order (PO) that needs to be sorted urgently.
> Additionally, Charlotte would like to inquire about the progress and any updates regarding the #Alligator Deal. She would like to stay informed and ensure everything is on track.
> Best Regards,

Context and values restored, via the `reHydrate` method:

> Dear Jim, 
> I hope this email finds you well. I have an important request on behalf of Maria from our team. Maria would greatly appreciate it if you could reach out to Philip at cfo@client.com and ask him to call her regarding the Purchase Order (PO) that needs to be sorted urgently.
>Additionally, Maria would like to inquire about the progress and any updates regarding the #Acquisition Deal. She would like to stay informed and ensure everything is on track.
> Best Regards,

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### From Source
#### Build
``` console
npm i
npm run build
```

#### Test
``` console
npm run test
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Warning

Please always review the data you store and send to 3rd party systems, to ensure the transit and storage complies with the legal requirements for your jurisdiction, industry and business obligations. The author(s) of this library take no responsibility nor accept any liability for any loss that may occur from either correct or incorrect usage of this library. 
<p align="right">(<a href="#readme-top">back to top</a>)</p>
