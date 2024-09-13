import { test, expect } from '@playwright/test';

test('Capture Desktop Landing Page Screenshot', async ({ page }) => {
  // Set up request interception to track API calls
  await page.route('**/api/**', route => {
    console.log(`API call made to: ${route.request().url()}`);
    route.continue();
  });

  // Navigate to the frontend URL
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  // Wait for the first post to appear
  await page.waitForSelector('[data-testid="post-item"]', { timeout: 10000 });

  // Scroll to bottom to ensure all content is loaded
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait a bit for any lazy-loaded content
  await page.waitForTimeout(2000);

  // Take a screenshot of the viewport only
  await page.screenshot({ path: '/screenshots/test-desktop-landing-page.png' });

  // Basic assertion to ensure we have at least one post
  const posts = await page.$$('[data-testid="post-item"]');
  expect(posts.length).toBeGreaterThan(0);

  // Log the number of posts found
  console.log(`Number of posts found: ${posts.length}`);
});