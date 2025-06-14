import request from 'supertest';
import app from '../../../../server';

describe('Auth Flow Integration Tests', () => {
  let accessToken: string;
  let refreshToken: string;
  const timestamp = Date.now();
  const testUser = {
    email: `integrationtest-${timestamp}@example.com`,
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
    firstName: 'Integration',
    lastName: 'Test'
  };

  describe('Complete Auth Flow', () => {
    it('should complete full auth flow: signup -> login -> refresh -> logout', async () => {
      // Step 1: Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body).toHaveProperty('success', true);
      expect(registerResponse.body).toHaveProperty('message', 'User registered successfully');
      expect(registerResponse.body.data).toHaveProperty('user');
      expect(registerResponse.body.data).toHaveProperty('accessToken');
      expect(registerResponse.body.data).toHaveProperty('refreshToken');
      
      // Save tokens from registration
      const registerTokens = registerResponse.body.data;
      
      // Step 2: Login with the registered user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('success', true);
      expect(loginResponse.body).toHaveProperty('message', 'Login successful');
      expect(loginResponse.body.data).toHaveProperty('user');
      expect(loginResponse.body.data).toHaveProperty('accessToken');
      expect(loginResponse.body.data).toHaveProperty('refreshToken');
      
      // Save tokens from login
      accessToken = loginResponse.body.data.accessToken;
      refreshToken = loginResponse.body.data.refreshToken;

      // Step 3: Use access token to access protected resource (if we had one)
      // This would be tested when we add protected endpoints

      // Step 4: Refresh the access token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty('success', true);
      expect(refreshResponse.body).toHaveProperty('message', 'Tokens refreshed successfully');
      expect(refreshResponse.body.data).toHaveProperty('accessToken');
      expect(refreshResponse.body.data).toHaveProperty('refreshToken');

      // Update tokens with refreshed ones
      accessToken = refreshResponse.body.data.accessToken;
      refreshToken = refreshResponse.body.data.refreshToken;

      // Step 5: Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body).toHaveProperty('success', true);
      expect(logoutResponse.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('Auth Flow Edge Cases', () => {
    it('should handle login with wrong credentials after successful registration', async () => {
      // First register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: `edgecase-${timestamp + 1}@example.com`,
          password: 'CorrectPass123',
          confirmPassword: 'CorrectPass123',
          firstName: 'Edge',
          lastName: 'Case'
        });

      // Try to login with wrong password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: `edgecase-${timestamp + 1}@example.com`,
          password: 'WrongPassword123'
        });

      expect(loginResponse.status).toBe(401);
      expect(loginResponse.body).toHaveProperty('success', false);
      expect(loginResponse.body).toHaveProperty('error', 'Authentication failed');
      expect(loginResponse.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should handle token refresh with invalid refresh token', async () => {
      const refreshResponse = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-refresh-token' });

      expect(refreshResponse.status).toBe(401);
      expect(refreshResponse.body).toHaveProperty('success', false);
      expect(refreshResponse.body).toHaveProperty('error', 'Authentication failed');
      expect(refreshResponse.body).toHaveProperty('message', 'Invalid or expired refresh token');
    });

    it('should handle multiple logins with same credentials', async () => {
      const credentials = {
        email: `multilogin-${timestamp + 2}@example.com`,
        password: 'MultiLogin123',
        confirmPassword: 'MultiLogin123',
        firstName: 'Multi',
        lastName: 'Login'
      };

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(credentials);

      // Login multiple times
      const login1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: credentials.email,
          password: credentials.password
        });

      const login2 = await request(app)
        .post('/api/auth/login')
        .send({
          email: credentials.email,
          password: credentials.password
        });

      expect(login1.status).toBe(200);
      expect(login2.status).toBe(200);
      expect(login1.body.data.accessToken).not.toBe(login2.body.data.accessToken);
    });
  });
}); 