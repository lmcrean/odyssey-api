const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
    },
    baseUrl: 'https://3000-lmcrean-momentsclone2-chab47zjuwx.ws.codeinstitute-ide.net/',
    supportFile: false,
    screenshotOnRunFailure: true,
  },
});