import request from 'supertest';
import app from '../../../../server';

describe('POST /api/auth/logout', () => {
  let validAccessToken: string;
  
  // Get a valid access token by logging in first
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });
    
    validAccessToken = loginResponse.body.data.accessToken;
  });

  describe('Successful Logout', () => {
    it('should logout successfully with valid access token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });

    it('should logout successfully without access token (public endpoint)', async () => {
      // Logout endpoint doesn't require authentication in current implementation
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });

    it('should logout successfully with invalid token (graceful handling)', async () => {
      // Since logout is mainly client-side token removal,
      // it should succeed even with invalid tokens
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });
  });

  describe('Multiple Logout Attempts', () => {
    it('should handle multiple logout requests', async () => {
      const logout1 = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validAccessToken}`);

      const logout2 = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(logout1.status).toBe(200);
      expect(logout2.status).toBe(200);
      
      expect(logout1.body).toHaveProperty('success', true);
      expect(logout2.body).toHaveProperty('success', true);
    });

    it('should handle concurrent logout requests', async () => {
      const logoutPromises = Array(5).fill(null).map(() =>
        request(app)
          .post('/api/auth/logout')
          .set('Authorization', `Bearer ${validAccessToken}`)
      );

      const responses = await Promise.all(logoutPromises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Logout successful');
      });
    });
  });

  describe('Different Token Formats', () => {
    it('should handle logout with malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle logout with missing Bearer prefix', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', validAccessToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle logout with empty authorization header', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', '');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('Logout Response Format', () => {
    it('should return consistent response format', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.success).toBe('boolean');
      expect(typeof response.body.message).toBe('string');
      
      // Should not include sensitive data
      expect(response.body).not.toHaveProperty('data');
      expect(response.body).not.toHaveProperty('token');
      expect(response.body).not.toHaveProperty('user');
    });

    it('should have appropriate response headers', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
}); 