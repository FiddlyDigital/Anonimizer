export enum ErrorMessages {
    InputNullOrEmpty = 'input needs to be a valid string value.',
    FeatureNullOrEmpty = 'feature needs to be a valid string value.',
    FeaturesToReplaceNullOrEmpty = 'featuresToReplace needs be a valid array with at least one value.',
    RunMapNullOrEmpty = 'runMap needs to be a valid RunValueMap with at least one feature set.',
    CouldntRehydrate = 'Couldn\'t rehydrate',
    CompromiseCantParse = 'Compromise unable to parse input.'
}

// TODO: More punctuation
// TODO: Add uppercase chars from https://www.ascii-code.com/characters/latin
// TODO: Add uppercase chars from https://www.ascii-code.com/characters/cyrillic
// TODO: Add uppercase chars from https://www.ascii-code.com/characters/greek
export enum RegexPatterns {
    Punctuation = '[.,!-+]',
    UppercaseChars = '[A-Z]'
}
