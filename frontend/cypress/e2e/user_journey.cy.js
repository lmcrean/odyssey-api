describe('User Journey', () => {
  const devices = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1366, height: 768 },
    { name: 'desktop', width: 1920, height: 1080 }
  ];

  devices.forEach((device) => {
    it(`1. Landing Page - ${device.name}`, () => {
      cy.viewport(device.width, device.height);
      
      cy.log(`Visiting the page for ${device.name}`);
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.stub(win.console, 'log').as('consoleLog');
          cy.stub(win.console, 'error').as('consoleError');
        }
      });
      
      // Log any console errors
      cy.get('@consoleError').then((consoleError) => {
        if (consoleError.callCount > 0) {
          cy.log('Console errors:', consoleError.args);
        }
      });

      // Check for basic page structure
      cy.log('Checking for basic page structure');
      cy.get('body', { timeout: 30000 }).should('be.visible');
      cy.get('[data-testid=app-container]', { timeout: 30000 }).should('exist');
      
      // Wait for content to load
      cy.log(`Waiting for content to load for ${device.name}`);
      cy.get('[data-testid=post-item]', { timeout: 60000 }).should('exist');
      
      // Check if posts are visible
      cy.get('[data-testid=post-item]').should('have.length.gt', 0);
      
      // Capture fully loaded state
      cy.screenshot(`user-journey/1-landing-page/landing_page_loaded_${device.name}`, { capture: 'viewport' });
      
      // Check if the page is scrollable
      cy.document().then((doc) => {
        const isScrollable = doc.documentElement.scrollHeight > doc.documentElement.clientHeight;
        if (isScrollable) {
          cy.log(`Page is scrollable for ${device.name}, scrolling and capturing`);
          cy.scrollTo('bottom', { duration: 2000 });
          cy.wait(2000); // Wait for any lazy-loaded content
          cy.screenshot(`user-journey/1-landing-page/landing_page_scrolled_${device.name}`, { capture: 'viewport' });
        } else {
          cy.log(`Page is not scrollable for ${device.name} viewport`);
        }
      });
    });
  });

  // Add error logging
  Cypress.on('uncaught:exception', (err, runnable) => {
    console.error('Uncaught exception:', err);
    return false; // returning false here prevents Cypress from failing the test
  });
});