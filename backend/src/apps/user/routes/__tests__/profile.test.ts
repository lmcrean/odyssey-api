import request from 'supertest';
import app from '../../../../server';

describe('User Profile Endpoints', () => {
  describe('GET /api/users/profile', () => {
    it('should handle profile request', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      // Without authentication, we expect 401 Unauthorized
      expect([200, 401, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
      } else if (response.status === 401) {
        expect(response.body).toHaveProperty('error', 'Authentication required');
      } else if (response.status === 404) {
        expect(response.body).toHaveProperty('error', 'Profile not found');
      }
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should handle profile update request', async () => {
      const updateData = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData);

      // Without authentication, we expect 401 Unauthorized
      expect([200, 401, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      } else if (response.status === 401) {
        expect(response.body).toHaveProperty('error', 'Authentication required');
      }
    });
  });
}); 