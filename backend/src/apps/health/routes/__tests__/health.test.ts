import request from 'supertest';
import app from '../../../../server';

describe('Health Endpoints', () => {
  describe('GET /api/health/hello', () => {
    it('should return hello message', async () => {
      const response = await request(app)
        .get('/api/health/hello')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Hello from Odyssey Backend!');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /api/health/hello-db', () => {
    it('should return database hello message', async () => {
      const response = await request(app)
        .get('/api/health/hello-db')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('source');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /api/health/db-health', () => {
    it('should return database health status', async () => {
      const response = await request(app)
        .get('/api/health/db-health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('message', 'Database connection successful');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
}); 