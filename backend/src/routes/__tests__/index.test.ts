import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server';

describe('Routes', () => {
  describe('GET /api/hello', () => {
    it('should return hello message', async () => {
      const response = await request(app)
        .get('/api/hello')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Hello from Odyssey Backend!');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message', 'Odyssey Backend is running');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
}); 