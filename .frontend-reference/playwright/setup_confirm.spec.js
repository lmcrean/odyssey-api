const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page).toHaveTitle(/Odyssey/);


  await page.waitForLoadState('networkidle');

  // Takes a screenshot
  await page.screenshot({
    path: `screenshots/setup-confirmed.png`,
    fullPage: false
  });

});