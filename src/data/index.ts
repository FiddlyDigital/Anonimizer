import { Features } from '../models';
import acronyms from './acronyms.json';
import emails from './emails.json';
import hashtags from './hashtags.json';
import organizations from './organizations.json';
import people from './people.json';
import phonenumbers from './phonenumbers.json';
import urls from './urls.json';

const dataMap = new Map<Features, string[]>();
dataMap.set(Features.Acronyms, acronyms);
dataMap.set(Features.Emails, emails);
dataMap.set(Features.HashTags, hashtags);
dataMap.set(Features.Organizations, organizations);
dataMap.set(Features.People, people);
dataMap.set(Features.Phonenumbers, phonenumbers);
dataMap.set(Features.Urls, urls);

export { dataMap };


