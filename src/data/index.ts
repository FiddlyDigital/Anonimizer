import { Feature } from '../models';
import acronyms from './acronyms.json';
import emails from './emails.json';
import hashtags from './hashtags.json';
import organizations from './organizations.json';
import people from './people.json';
import phonenumbers from './phonenumbers.json';
import urls from './urls.json';

const dataMap = new Map<Feature, string[]>();
dataMap.set(Feature.Acronyms, acronyms);
dataMap.set(Feature.Emails, emails);
dataMap.set(Feature.HashTags, hashtags);
dataMap.set(Feature.Organizations, organizations);
dataMap.set(Feature.People, people);
dataMap.set(Feature.Phonenumbers, phonenumbers);
dataMap.set(Feature.Urls, urls);

export { dataMap };
