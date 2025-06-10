import request from 'supertest';
import app from '../../../../server';

describe('POST /api/auth/refresh-token', () => {
  let validRefreshToken: string;
  
  // Get a valid refresh token by logging in first
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
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
      
      // New tokens should be different from the old ones
      expect(response.body.data.accessToken).not.toBe(validRefreshToken);
      expect(response.body.data.refreshToken).not.toBe(validRefreshToken);
    });

    it('should generate new tokens that are different from previous ones', async () => {
      const refresh1 = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      const refresh2 = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      expect(refresh1.status).toBe(200);
      expect(refresh2.status).toBe(200);
      
      // Each refresh should generate different tokens
      expect(refresh1.body.data.accessToken).not.toBe(refresh2.body.data.accessToken);
      expect(refresh1.body.data.refreshToken).not.toBe(refresh2.body.data.refreshToken);
    });
  });

  describe('Failed Token Refresh', () => {
    it('should reject refresh with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-refresh-token' });

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
      expect(response.body).toHaveProperty('message', 'Refresh token is required');
    });

    it('should reject refresh with empty refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Refresh token is required');
    });

    it('should reject refresh with malformed JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'malformed.jwt.token' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
      expect(response.body).toHaveProperty('message', 'Invalid or expired refresh token');
    });

    it('should reject refresh with expired refresh token format', async () => {
      // Create a token with a very short expiry (this would be expired in real scenario)
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid-signature' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
    });
  });

  describe('Refresh Token Usage Patterns', () => {
    it('should handle multiple refresh requests with same token', async () => {
      // In a real implementation, you might want to invalidate used refresh tokens
      // For now, we allow multiple uses of the same refresh token
      
      const refresh1 = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      const refresh2 = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      expect(refresh1.status).toBe(200);
      expect(refresh2.status).toBe(200);
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