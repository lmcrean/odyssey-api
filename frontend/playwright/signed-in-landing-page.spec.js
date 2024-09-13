import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

const devices = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1920, height: 1080 }
];

async function signIn(request) {
  const signInResponse = await request.post(`${BASE_URL}/api/dj-rest-auth/login/`, {
    data: {
      username: 'user',
      password: 'qwerqwer*'
    }
  });

  expect(signInResponse.ok()).toBeTruthy();
  return await signInResponse.json();
}

devices.forEach(device => {
  test(`Signed-in Landing Page - ${device.name}`, async ({ page, request }) => {
    // Set the viewport size for the device
    await page.setViewportSize({ width: device.width, height: device.height });

    // Sign in
    const authData = await signIn(request);

    // Navigate to the base URL
    await page.goto(BASE_URL);

    // Set tokens in localStorage
    await page.evaluate(({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }, { 
      accessToken: authData.access_token, 
      refreshToken: authData.refresh_token 
    });

    // Reload the page to apply the authenticated state
    await page.reload({ waitUntil: 'networkidle' });

    // Take a screenshot of the signed-in landing page
    await page.screenshot({
      path: `screenshots/signed-in-landing-page-${device.name}.png`,
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
        path: `screenshots/signed-in-landing-page-${device.name}-scrolled.png`,
        fullPage: false
      });
    }

    // Log completion
    console.log(`Signed-in landing page screenshot captured for ${device.name}`);
  });
});