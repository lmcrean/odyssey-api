const { test, expect } = require('@playwright/test');

test.describe('User Authentication', () => {
  const API_URL = 'https://odyssey-api-f3455553b29d.herokuapp.com';
  const FRONTEND_URL = 'https://3000-lmcrean-momentsclone2-chab47zjuwx.ws.codeinstitute-ide.net';

  test('User can sign in with dj-rest-auth', async ({ page, request }) => {
    // 1. Attempt to sign in
    const signInResponse = await request.post(`${API_URL}/dj-rest-auth/login/`, {
      data: {
        username: 'user',
        password: 'qwerqwer*'
      }
    });

    // 2. Check if sign-in was successful
    expect(signInResponse.ok()).toBeTruthy();
    const responseBody = await signInResponse.json();
    
    // 3. Verify response contains necessary tokens
    expect(responseBody).toHaveProperty('access_token');
    expect(responseBody).toHaveProperty('refresh_token');
    
    const accessToken = responseBody.access_token;
    const refreshToken = responseBody.refresh_token;

    // 4. Set tokens in localStorage
    await page.goto(FRONTEND_URL);
    await page.evaluate(({ accessToken, refreshToken }) => {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }, { accessToken, refreshToken });

    // 5. Verify tokens are set correctly
    const storedAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const storedRefreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(storedAccessToken).toBe(accessToken);
    expect(storedRefreshToken).toBe(refreshToken);

    // 6. Use access token to make an authenticated request
    const userResponse = await request.get(`${API_URL}/dj-rest-auth/user/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    // 7. Check if authenticated request was successful
    expect(userResponse.ok()).toBeTruthy();
    const userData = await userResponse.json();
    expect(userData).toHaveProperty('username', 'user');

    console.log('Authentication successful. User data:', userData);
  });
});