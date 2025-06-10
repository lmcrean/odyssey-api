const { test, expect } = require('@playwright/test');

test.describe('Authorized User Test', () => {
  const BASE_URL = 'http://localhost:8000';

  test('Authorized user can visit /messages', async ({ page, request }) => {
    // Step 1: Sign in the user using the auth logic from auth.spec.js
    const signInResponse = await request.post(`${BASE_URL}/api/dj-rest-auth/login/`, {
      data: {
        username: 'user',
        password: 'qwerqwer*'
      }
    });

    // Step 2: Verify successful sign-in
    expect(signInResponse.ok()).toBeTruthy();
    const responseBody = await signInResponse.json();

    // Verify response contains necessary tokens
    expect(responseBody).toHaveProperty('access');
    expect(responseBody).toHaveProperty('refresh');
    const accessToken = responseBody.access;

    // Step 3: Use the signed-in user's token to visit the /messages page
    // Setting token in local storage to simulate authenticated state
    await page.addInitScript(token => {
      window.localStorage.setItem('accessToken', token);
    }, accessToken);

    // Step 4: Navigate to the /messages page
    await page.goto(`${BASE_URL}/messages`, { waitUntil: 'networkidle' });

    // Step 5: Verify that the user is on the correct page
    const url = page.url();
    expect(url).toBe(`${BASE_URL}/messages`);
    console.log(`User successfully navigated to: ${url}`);

    // Step 6: Log the completion of the test
    console.log('Authorized user successfully visited /messages');

    // Step 7: Take a screenshot
    await page.screenshot({
      path: `screenshots/messages-page.png`, // currently,the screenshot saves as expected, however, upon inspection it confirms that MESSAGES is not visible.
      fullPage: false
    });
  });
});
