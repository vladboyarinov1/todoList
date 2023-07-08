// module.exports = {
//     preset: 'jest-puppeteer',
//     testRegex: './*\\.test\\.js$',
//     setupFilesAfterEnv: ['./setupTests.js']
// };
module.exports = {
    preset: 'jest-puppeteer',
    testRegex: './*\\.test\\.js$',
    setupFilesAfterEnv: ['./setupTests.js'],
    transform: {
        '^.+\\.(js)$': 'babel-jest',
    },
};