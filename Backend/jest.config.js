export default {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js',
        '!src/utils/test/**'
    ],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/*.test.js'
    ],
    verbose: true,
    testTimeout: 60000
};
