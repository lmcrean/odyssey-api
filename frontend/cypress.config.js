const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/component.js',
    screenshotOnRunFailure: true,
    video: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    videoUploadOnPasses: true,
  },
});