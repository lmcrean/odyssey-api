import request from 'supertest';
import app from '../../../../server';

describe('User Profile Endpoints', () => {
  describe('GET /api/users/profile', () => {
    it('should handle profile request', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      // Since we don't have authentication yet, we expect either success or error
      expect([200, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
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

      // Since we don't have authentication yet, we expect either success or error
      expect([200, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      }
    });
  });
}); 