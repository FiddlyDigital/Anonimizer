import type { ReplacementOptions } from './replacementOptions';

export class RunValueMap {
    opts: ReplacementOptions;

    acronyms: Map<string, string>;
    emails: Map<string, string>;
    hashTags: Map<string, string>;
    organizations: Map<string, string>;
    people: Map<string, string>;
    phonenumbers: Map<string, string>;
    urls: Map<string, string>;

    constructor (options: ReplacementOptions) {
        this.opts = options;

        this.acronyms = new Map<string, string>();
        this.emails = new Map<string, string>();
        this.hashTags = new Map<string, string>();
        this.organizations = new Map<string, string>();
        this.people = new Map<string, string>();
        this.phonenumbers = new Map<string, string>();
        this.urls = new Map<string, string>();
    }
};
