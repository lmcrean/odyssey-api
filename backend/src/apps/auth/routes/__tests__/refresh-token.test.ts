import request from 'supertest';
import app from '../../../../server';

describe('POST /api/auth/refresh-token', () => {
  let validRefreshToken: string;
  const timestamp = Date.now();
  const testUser = {
    email: `refreshtest-${timestamp}@example.com`,
    password: 'RefreshTest123',
    confirmPassword: 'RefreshTest123',
    firstName: 'Refresh',
    lastName: 'Test'
  };

  beforeAll(async () => {
    // Register a user first
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Get valid tokens for testing
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    validRefreshToken = loginResponse.body.data.refreshToken;
  });

  describe('Successful Token Refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Tokens refreshed successfully');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      
      // Tokens should be strings and not empty
      expect(typeof response.body.data.accessToken).toBe('string');
      expect(typeof response.body.data.refreshToken).toBe('string');
      expect(response.body.data.accessToken.length).toBeGreaterThan(0);
      expect(response.body.data.refreshToken.length).toBeGreaterThan(0);
    });

    it('should generate new tokens that are different from previous', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      expect(response.status).toBe(200);
      
      // New tokens should be different from the original ones
      expect(response.body.data.accessToken).not.toBe(validRefreshToken);
      expect(response.body.data.refreshToken).not.toBe(validRefreshToken);
      
      // Access and refresh tokens should be different from each other
      expect(response.body.data.accessToken).not.toBe(response.body.data.refreshToken);
    });

    it('should generate new tokens that are different from previous ones', async () => {
      const firstRefresh = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      // Use the new refresh token for another refresh
      const secondRefresh = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: firstRefresh.body.data.refreshToken });

      expect(firstRefresh.status).toBe(200);
      expect(secondRefresh.status).toBe(200);
      
      // All tokens should be different
      expect(firstRefresh.body.data.accessToken).not.toBe(secondRefresh.body.data.accessToken);
      expect(firstRefresh.body.data.refreshToken).not.toBe(secondRefresh.body.data.refreshToken);
    });
  });

  describe('Failed Token Refresh', () => {
    it('should reject refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
      expect(response.body).toHaveProperty('message', 'Invalid or expired refresh token');
    });

    it('should reject refresh with missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Refresh token is required');
    });

    it('should reject refresh with null refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: null });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should reject refresh with empty refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should reject refresh with malformed JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'malformed.jwt.token' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
    });

    it('should reject refresh with expired refresh token format', async () => {
      // This simulates an expired token (would need actual JWT expiry for real test)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxfQ.expired';
      
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: expiredToken });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
    });
  });

  describe('Refresh Token Usage Patterns', () => {
    it('should handle multiple refresh requests with same token', async () => {
      // Note: In a real implementation, refresh tokens might be single-use
      // This test validates the current implementation behavior
      const response1 = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      const response2 = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      // Both requests should succeed in current implementation
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      
      // But they should generate different tokens
      expect(response1.body.data.accessToken).not.toBe(response2.body.data.accessToken);
    });

    it('should work with newly generated refresh token', async () => {
      // Get new tokens
      const firstRefresh = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      expect(firstRefresh.status).toBe(200);
      
      // Use the new refresh token
      const secondRefresh = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: firstRefresh.body.data.refreshToken });

      expect(secondRefresh.status).toBe(200);
      expect(secondRefresh.body.data).toHaveProperty('accessToken');
      expect(secondRefresh.body.data).toHaveProperty('refreshToken');
    });
  });
}); 