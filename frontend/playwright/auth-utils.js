const { expect } = require('@playwright/test');

/**
 * Sets the authentication state for the current page.
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Object} tokens - An object containing accessToken and refreshToken
 * @param {string} tokens.accessToken - The JWT access token
 * @param {string} tokens.refreshToken - The JWT refresh token
 */

async function setAuthState(page, { accessToken, refreshToken }) {
  await page.evaluate(({ accessToken, refreshToken }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Dispatch a storage event to trigger any listeners in the app
    window.dispatchEvent(new Event('storage'));
  }, { accessToken, refreshToken });

  // Wait for the app to recognize the auth state
  // This assumes that when authenticated, a 'Sign out' button/link is visible
  await expect(page.locator('text=Sign out')).toBeVisible({ timeout: 5000 });
}

module.exports = { setAuthState };