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
      
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.stub(win.console, 'log').as('consoleLog');
          cy.stub(win.console, 'error').as('consoleError');
        }
      });
      
      // Check for console errors
      cy.get('@consoleError').then((consoleError) => {
        expect(consoleError).to.have.callCount(0);
      });

      // Wait for content to load
      cy.get('[data-testid=post-item]', { timeout: 60000 }).should('exist');
      
      // Check if posts are visible and not overflowing
      cy.get('[data-testid=post-item]').each(($post) => {
        cy.wrap($post).should('be.visible');
        cy.wrap($post).then(($el) => {
          const rect = $el[0].getBoundingClientRect();
          expect(rect.left).to.be.at.least(0);
          expect(rect.right).to.be.at.most(device.width);
        });
      });
      
      // Check for horizontal overflow
      cy.get('body').then(($body) => {
        const bodyWidth = $body[0].scrollWidth;
        expect(bodyWidth).to.be.at.most(device.width, 'Body should not overflow horizontally');
      });
      
      // Check if content is scrollable
      cy.window().then((win) => {
        const bodyHeight = win.document.body.scrollHeight;
        const viewportHeight = win.innerHeight;
        
        if (bodyHeight > viewportHeight) {
          cy.log(`Content is scrollable: ${bodyHeight}px > ${viewportHeight}px`);
        } else {
          cy.log(`Content fits within viewport: ${bodyHeight}px <= ${viewportHeight}px`);
        }
        
        // Ensure at least some content is visible
        expect(bodyHeight).to.be.at.least(viewportHeight * 0.5, 'Content should fill at least half the viewport');
      });
      
      // Capture screenshots
      cy.screenshot(`user-journey/1-landing-page/landing_page_loaded_${device.name}`, { capture: 'viewport' });
      
      cy.scrollTo('bottom', { duration: 2000 });
      cy.wait(2000);
      cy.screenshot(`user-journey/1-landing-page/landing_page_scrolled_${device.name}`, { capture: 'viewport' });
    });
  });
});