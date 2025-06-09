import { test, expect } from '@playwright/test';

const devices = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];

devices.forEach(device => {
  test(`User Journey - Landing Page - ${device.name}`, async ({ page }) => {
    // Set the viewport size for the device
    await page.setViewportSize({ width: device.width, height: device.height });

    // Navigate to the frontend URL and wait for network idle
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

    // Take a screenshot of the viewport only
    await page.screenshot({
      path: `screenshots/landing-page-${device.name}.png`,
      fullPage: false
    });

    // Find all posts
    const posts = await page.$$('[data-testid="post-item"]');

    // If there's more than one post, scroll to the top of the second post
    if (posts.length > 1) {
        await page.evaluate((post) => {
            post.scrollIntoView({ block: 'start', inline: 'start' });
        }, posts[1]);
        
        // Wait a moment for any animations to settle
        await page.waitForTimeout(500);

        // Take a screenshot of the scrolled view
        await page.screenshot({
            path: `screenshots/landing-page-${device.name}-scrolled.png`,
            fullPage: false
        });
    }

    // Log completion
    console.log(`Screenshot captured for ${device.name}`);
  });
});