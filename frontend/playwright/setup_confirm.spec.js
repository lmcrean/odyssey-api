const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await expect(page).toHaveTitle(/Odyssey/);
});