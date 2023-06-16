module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    preset: 'ts-jest/presets/js-with-ts',
    transform: {
        '^.+\\.ts?$': ['ts-jest', {
            tsconfig: './src/tsconfig.json',
        }]
    },
    testEnvironment: 'node',
    testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
};