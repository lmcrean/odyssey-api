import { test, expect } from '@playwright/test';
import { login, captureScreenshot } from './testUtils';

const BASE_URL = 'http://localhost:8080';

const devices = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];

test.describe('Multi-page and Multi-device Test', () => {
  test('capture screenshots across pages and devices', async ({ page }) => {
    async function scrollToFourthPost(page) {
      try {
        const fourthPostExists = await page.evaluate(() => {
          const posts = document.querySelectorAll('[data-testid="post-item"]');
          if (posts.length >= 4) {
            posts[3].scrollIntoView({ behavior: 'smooth', block: 'center' });
            return true;
          }
          console.log(`Only ${posts.length} posts found.`);
          return false;
        });
    
        if (fourthPostExists) {
          console.log('Scrolled to 4th post');
          await page.waitForTimeout(2000); // Wait for scroll to complete and any animations to finish
          await captureScreenshot(page, 'landing-page', 'scrolled-to-4th-post');
        } else {
          console.log('Could not scroll to 4th post, capturing current view');
          await captureScreenshot(page, 'current-posts-view');
        }
      } catch (error) {
        console.error('Error while trying to scroll to 4th post:', error);
        await captureScreenshot(page, 'landing-page', 'error-state-view');
      }
    }

    // Navigate to signin page and capture screenshots
    await page.goto(`${BASE_URL}/signin`);

    // Fill in the login form
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'qwerqwer*');

    // Click the sign-in button and wait for navigation
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation(),
    ]);

    console.log('Login attempted');

    // Check if redirected to home page
    expect(page.url()).toBe(`${BASE_URL}/`);
    console.log('Redirected to home page');

    // Check localStorage for access token
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    console.log(accessToken ? 'Access token found in localStorage' : 'Warning: No access token found in localStorage');

    // Capture screenshots of homepage after login
    await captureScreenshot(page,'landing-page', 'home-page-after-login');

    // Scroll to the 4th post and capture screenshots
    await scrollToFourthPost(page);

    console.log('Test completed for all pages and device views');
  });
});