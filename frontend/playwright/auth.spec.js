const { test, expect } = require('@playwright/test');

test.describe('User Authentication', () => {
  const BASE_URL = 'http://localhost:8000';

  test('User can sign in with dj-rest-auth', async ({ page, request }) => {
    // 1. Attempt to sign in
    try {
      const signInResponse = await request.post(`${BASE_URL}/api/dj-rest-auth/login/`, {
        data: {
          username: 'user',
          password: 'qwerqwer*'
        }
      });

      // 2. Check if sign-in was successful
      expect(signInResponse.ok()).toBeTruthy();
      const responseBody = await signInResponse.json();
      
      // Log the response for debugging
      console.log('Sign-in response:', responseBody);

      // 3. Verify response contains necessary tokens
      expect(responseBody).toHaveProperty('access_token');
      expect(responseBody).toHaveProperty('refresh_token');
      
      // ... rest of the test ...
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  });
});